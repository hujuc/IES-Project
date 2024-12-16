package pt.ua.deti.ies.backend.service;

import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.model.Room;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
import pt.ua.deti.ies.backend.model.House;
import pt.ua.deti.ies.backend.repository.HouseRepository;
import pt.ua.deti.ies.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.beans.FeatureDescriptor;
import java.util.*;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final HouseRepository houseRepository;
    private final RoomRepository roomRepository;

    public DeviceService(DeviceRepository deviceRepository, RoomRepository roomRepository, HouseRepository houseRepository) {
        this.deviceRepository = deviceRepository;
        this.roomRepository = roomRepository;
        this.houseRepository = houseRepository;
    }

    public Optional<Device> getDeviceById(String deviceId) {
        return deviceRepository.findById(deviceId);
    }

    public List<Device> getDevicesByIds(List<String> deviceIds) {
        return deviceRepository.findAllById(deviceIds);
    }


    public Device createDevice(Device device) {
        return deviceRepository.save(device);
    }

    public void deleteDevice(String deviceId) {
        deviceRepository.deleteById(deviceId);
    }

    public List<Device> getDevicesByRoomId(String roomId) {
        return roomRepository.findById(roomId)
                .map(room -> deviceRepository.findAllById(room.getDevices())) // Busca dispositivos pelos IDs em Room
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public List<Device> getDevicesByHouseId(String houseId) {
        return houseRepository.findById(houseId)
                .map(house -> house.getRooms().stream()
                        .flatMap(roomId -> roomRepository.findById(roomId)
                                .map(room -> deviceRepository.findAllById(room.getDevices())).stream())
                        .flatMap(List::stream)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new RuntimeException("House not found"));
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Device updateDevice(String deviceId, Device updatedDevice) {
        Device existingDevice = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found with ID: " + deviceId));

        BeanUtils.copyProperties(updatedDevice, existingDevice, getNullPropertyNames(updatedDevice));

        return deviceRepository.save(existingDevice);
    }

    private String[] getNullPropertyNames(Object source) {
        final BeanWrapper wrappedSource = new BeanWrapperImpl(source);
        return Arrays.stream(wrappedSource.getPropertyDescriptors())
                .map(FeatureDescriptor::getName)
                .filter(propertyName -> wrappedSource.getPropertyValue(propertyName) == null)
                .toArray(String[]::new);
    }

    public String getHouseIdByDeviceId(String deviceId) {
        return houseRepository.findAll().stream()
                .filter(house -> house.getDevices().contains(deviceId))
                .map(House::getHouseId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("[ERROR] House associated with the device not found."));
    }

    public Device addDeviceByUser(String houseId, String roomType, String type, String name) {
        // Validar se o nome foi fornecido
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Device name is required.");
        }

        // Obter o Room correspondente ao roomType na houseId
        Room room = houseRepository.findById(houseId)
                .flatMap(house -> house.getRooms().stream()
                        .map(roomId -> roomRepository.findById(roomId).orElse(null)) // Buscar cada Room pelo ID
                        .filter(r -> r != null && r.getType().equalsIgnoreCase(roomType)) // Filtrar pelo tipo
                        .findFirst())
                .orElseThrow(() -> new RuntimeException("Room not found for type: " + roomType + " in house: " + houseId));

        // Gerar o ID base do dispositivo
        String baseId = type + "_" + roomType + "_" + houseId;
        String finalId = baseId;

        // Garantir unicidade do ID
        int suffix = 1;
        while (deviceRepository.existsById(finalId)) {
            finalId = baseId + "_" + suffix;
            suffix++;
        }

        // Criar o dispositivo
        Device device = new Device(finalId, type);
        device.setName(name); // Usar o nome fornecido pelo usuário

        // Configurar atributos padrão com base no tipo
        switch (type) {
            case "dryerMachine":
                device.setState(false);
                device.setTemperature(50.0);
                device.setMode("Gentle Dry");
                break;
            case "washingMachine":
                device.setState(false);
                device.setTemperature(20.0);
                device.setMode("Gentle Wash");
                break;
            case "lamp":
                device.setState(false);
                device.setBrightness(1);
                device.setColor("#FFFFFF");
                break;
            case "airConditioner":
                device.setState(false);
                device.setTemperature(12.0);
                device.setMode("hot");
                device.setAirFluxDirection("down");
                device.setAirFluxRate("low");
                break;
            case "shutter":
                device.setState(false);
                device.setOpenPercentage(0);
                break;
            case "heatedFloor":
                device.setState(false);
                device.setTemperature(10.0);
                break;
            case "television":
                device.setState(false);
                device.setVolume(0);
                device.setBrightness(10);
                break;
            case "clock":
                device.setState(false);
                device.setRinging(false);
                device.setAlarmSound("sound 1");
                break;
            case "stereo":
                device.setState(false);
                device.setVolume(0);
                break;
            case "coffeeMachine":
                device.setState(false);
                device.setDrinkType("tea");
                break;
            default:
                throw new IllegalArgumentException("Unsupported device type: " + type);
        }

        // Salvar o dispositivo no banco de dados
        Device savedDevice = deviceRepository.save(device);

        // Atualizar o Room com o novo dispositivo
        List<String> roomDevices = room.getDevices();
        roomDevices.add(savedDevice.getDeviceId());
        room.setDevices(roomDevices);
        roomRepository.save(room);

        // Atualizar a House com o novo dispositivo
        House house = houseRepository.findById(houseId)
                .orElseThrow(() -> new RuntimeException("House not found with ID: " + houseId));
        List<String> houseDevices = house.getDevices();
        houseDevices.add(savedDevice.getDeviceId());
        house.setDevices(houseDevices);
        houseRepository.save(house);

        return savedDevice;
    }

    public boolean removeDeviceByUser(String deviceId) {
        // Procurar o dispositivo
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);

        if (deviceOptional.isEmpty()) {
            throw new RuntimeException("Device not found with ID: " + deviceId);
        }

        // Encontrar o Room específico que contém o dispositivo
        roomRepository.findAll().forEach(room -> {
            boolean roomUpdated = false;

            // Verificar se o dispositivo está na lista de IDs (devices)
            if (room.getDevices() != null && room.getDevices().contains(deviceId)) {
                room.getDevices().remove(deviceId); // Remover o ID do dispositivo
                roomUpdated = true;
            }

            // Verificar se o dispositivo está na lista de objetos (deviceObjects)
            if (room.getDeviceObjects() != null) {
                room.setDeviceObjects(
                        room.getDeviceObjects().stream()
                                .filter(device -> !device.getDeviceId().equals(deviceId)) // Filtrar o dispositivo a ser removido
                                .collect(Collectors.toList())
                );
                roomUpdated = true;
            }

            // Salvar as alterações somente se algo foi modificado
            if (roomUpdated) {
                roomRepository.save(room);
            }
        });

        // Encontrar a House específica que contém o dispositivo
        houseRepository.findAll().forEach(house -> {
            if (house.getDevices() != null && house.getDevices().contains(deviceId)) {
                house.getDevices().remove(deviceId); // Remover o ID do dispositivo da House
                houseRepository.save(house); // Salvar as alterações na House
            }
        });

        // Finalmente, remover o dispositivo do repositório de dispositivos
        deviceRepository.deleteById(deviceId);

        return true; // Indicar que a operação foi bem-sucedida
    }

}