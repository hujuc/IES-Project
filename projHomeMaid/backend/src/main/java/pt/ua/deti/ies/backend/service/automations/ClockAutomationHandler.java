package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class ClockAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public ClockAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("ringing")) {
            boolean ringing = (boolean) changes.get("ringing");

            if (ringing) {
                String alarmSound = changes.containsKey("alarmSound")
                        ? (String) changes.get("alarmSound")
                        : device.getAlarmSound();

                int volume = changes.containsKey("volume")
                        ? ((Number) changes.get("volume")).intValue()
                        : device.getVolume();

                device.setRinging(true);
                device.setState(true);
                device.setAlarmSound(alarmSound);
                device.setVolume(volume);


                scheduler.schedule(() -> {
                    Device updatedDevice = deviceRepository.findById(device.getDeviceId()).orElse(null);
                    if (updatedDevice != null && updatedDevice.getRinging() && updatedDevice.getState()) {
                        updatedDevice.setRinging(false);
                        updatedDevice.setState(false);
                        deviceRepository.save(updatedDevice);
                    }
                }, 30, TimeUnit.SECONDS);
            } else {
                device.setRinging(false);
                device.setState(false);
            }

            deviceRepository.save(device);
        }
    }
}
