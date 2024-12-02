package pt.ua.deti.ies.backend.service;

import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;
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


    // getAllDevices:
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }
}