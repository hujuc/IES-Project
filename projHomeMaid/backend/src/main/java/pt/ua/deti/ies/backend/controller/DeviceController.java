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

import java.util.Timer;
import java.util.TimerTask;

import java.util.*;

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
    public ResponseEntity<Device> updateDevice(
            @Parameter(description = "ID do dispositivo a ser atualizado", required = true) @PathVariable String deviceId,
            @Parameter(description = "Dados atualizados do dispositivo", required = true) @RequestBody Device device) {
        Device updatedDevice = deviceService.updateDevice(deviceId, device);
        return ResponseEntity.ok(updatedDevice);
    }

    @Operation(summary = "Listar todos os dispositivos", description = "Retorna uma lista de todos os dispositivos no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de dispositivos retornada com sucesso")
    })
    @GetMapping
    public ResponseEntity<List<Device>> getAllDevices() {
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @PostMapping("/{deviceId}/toggle")
    public ResponseEntity<?> toggleDeviceState(@PathVariable String deviceId) {
        Optional<Device> optionalDevice = deviceService.getDeviceById(deviceId); // Handle Optional here

        if (optionalDevice.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found.");
        }

        Device device = optionalDevice.get(); // Extract the Device from Optional

        if (device.getState()) { // Ensure the `getState()` method matches the getter in the `Device` class
            return ResponseEntity.badRequest().body("Device is already on.");
        }

        // Turn on the device
        device.setState(true);
        deviceService.updateDevice(deviceId, device); // Include deviceId to match the service's update method signature

        // Schedule state reset after 30 seconds
        new Timer().schedule(new TimerTask() { // Ensure Timer and TimerTask are imported
            @Override
            public void run() {
                device.setState(false);
                deviceService.updateDevice(deviceId, device); // Include deviceId to match the service's update method signature
            }
        }, 30000); // 30 seconds

        return ResponseEntity.ok(device);
    }

}