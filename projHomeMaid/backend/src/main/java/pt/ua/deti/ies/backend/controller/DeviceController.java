package pt.ua.deti.ies.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Optional;

import java.util.*;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<Device> getDeviceById(
            @Parameter(description = "ID do dispositivo", required = true) @PathVariable String deviceId) {
        return deviceService.getDeviceById(deviceId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<Device> createDevice(
            @Parameter(description = "Dados do novo dispositivo", required = true) @RequestBody Device device) {
        Device createdDevice = deviceService.createDevice(device);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDevice);
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<Void> deleteDevice(
            @Parameter(description = "ID do dispositivo a ser deletado", required = true) @PathVariable String deviceId) {
        deviceService.deleteDevice(deviceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rooms/{roomId}/devices")
    public List<Device> getDevicesByRoomId(
            @Parameter(description = "ID do quarto", required = true) @PathVariable String roomId) {
        return deviceService.getDevicesByRoomId(roomId);
    }

    @GetMapping("/houses/{houseId}/devices")
    public List<Device> getDevicesByHouseId(
            @Parameter(description = "ID da casa", required = true) @PathVariable String houseId) {
        return deviceService.getDevicesByHouseId(houseId);
    }

    @PatchMapping("/{deviceId}")
    public ResponseEntity<Device> updateDeviceField(
            @PathVariable String deviceId,
            @RequestBody Map<String, Object> updates) {
        Optional<Device> optionalDevice = deviceService.getDeviceById(deviceId);

        if (optionalDevice.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Device device = optionalDevice.get();

        updates.forEach((field, value) -> {
            switch (field) {
                case "name":
                    device.setName((String) value);
                    break;
                case "type":
                    device.setType((String) value);
                    break;
                case "state":
                    device.setState((Boolean) value);
                    break;
                case "brightness":
                    device.setBrightness((Integer) value);
                    break;
                case "color":
                    device.setColor((String) value);
                    break;
                case "openPercentage":
                    device.setOpenPercentage((Integer) value);
                    break;
                case "volume":
                    device.setVolume((Integer) value);
                    break;
                case "temperature":
                    device.setTemperature((Double) value);
                    break;
                case "mode":
                    device.setMode((String) value);
                    break;
                case "ringing":
                    device.setRinging((Boolean) value);
                    break;
                case "airFluxDirection":
                    device.setAirFluxDirection((String) value);
                    break;
                case "airFluxRate":
                    device.setAirFluxRate((Integer) value);
                    break;
                default:
                    throw new IllegalArgumentException("Campo desconhecido: " + field);
            }
        });

        Device updatedDevice = deviceService.updateDevice(device);

        return ResponseEntity.ok(updatedDevice);
    }
}