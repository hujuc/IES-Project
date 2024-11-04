package pt.ua.deti.ies.homemaid.controller;

import pt.ua.deti.ies.homemaid.model.Device;
import pt.ua.deti.ies.homemaid.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<Device> getDeviceById(@PathVariable String deviceId) {
        return deviceService.getDeviceById(deviceId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody Device device) {
        Device createdDevice = deviceService.createDevice(device);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDevice);
    }

    @PutMapping("/{deviceId}")
    public ResponseEntity<Device> updateDevice(@PathVariable String deviceId, @RequestBody Device device) {
        Device updatedDevice = deviceService.updateDevice(deviceId, device);
        return ResponseEntity.ok(updatedDevice);
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<Void> deleteDevice(@PathVariable String deviceId) {
        deviceService.deleteDevice(deviceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rooms/{roomId}/devices")
    public List<Device> getDevicesByRoomId(@PathVariable String roomId) {
        return deviceService.getDevicesByRoomId(roomId);
    }

    @GetMapping("/houses/{houseId}/devices")
    public List<Device> getDevicesByHouseId(@PathVariable String houseId) {
        return deviceService.getDevicesByHouseId(houseId);
    }
}
