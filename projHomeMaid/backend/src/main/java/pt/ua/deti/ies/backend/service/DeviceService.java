package pt.ua.deti.ies.backend.service;

import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
import pt.ua.deti.ies.backend.repository.HouseRepository;
import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.repository.RoomRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public Device createDevice(Device device) {
        return deviceRepository.save(device);
    }

    public Device updateDevice(String deviceId, Device updatedDevice) {
        updatedDevice.setDeviceId(deviceId);
        return deviceRepository.save(updatedDevice);
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
}