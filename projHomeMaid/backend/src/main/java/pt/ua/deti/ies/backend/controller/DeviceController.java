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
import java.util.Optional;

import java.util.Timer;
import java.util.TimerTask;


import java.util.*;

@RestController
@CrossOrigin(
        origins = {
                "http://localhost:5173"
        },
        methods = {
                RequestMethod.GET,
                RequestMethod.DELETE,
                RequestMethod.POST,
                RequestMethod.PATCH
        })
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
    public ResponseEntity<Device> updateDevice(
            @Parameter(description = "ID do dispositivo a ser atualizado", required = true) @PathVariable String deviceId,
            @Parameter(description = "Dados atualizados do dispositivo", required = true) @RequestBody Device device) {
        Device updatedDevice = deviceService.updateDevice(deviceId, device);
        return ResponseEntity.ok(updatedDevice);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getAllDevices() {
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @PostMapping("/add")
    public ResponseEntity<Device> addDeviceByUser(@RequestBody Map<String, String> payload) {
        try {
            String houseId = payload.get("houseId");
            String roomType = payload.get("roomType");
            String type = payload.get("type");
            String name = payload.get("name");

            if (houseId == null || roomType == null || type == null || name == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(null);
            }

            Device newDevice = deviceService.addDeviceByUser(houseId, roomType, type, name);
            return ResponseEntity.status(HttpStatus.CREATED).body(newDevice);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeDeviceByUser(@RequestBody Map<String, String> body) {
        String deviceId = body.get("deviceId");

        if (deviceId == null || deviceId.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Device ID is required.");
        }

        try {
            deviceService.removeDeviceByUser(deviceId);
            return ResponseEntity.ok("Device removed successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error removing device.");
        }
    }

}