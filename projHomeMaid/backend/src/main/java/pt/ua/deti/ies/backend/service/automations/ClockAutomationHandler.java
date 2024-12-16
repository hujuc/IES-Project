package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class ClockAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public ClockAutomationHandler(DeviceRepository deviceRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.deviceRepository = deviceRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @Override
    public void executeAutomation(Device device, Map<String, Object> changes) {
        if (changes.containsKey("ringing")) {
            boolean ringing = (boolean) changes.get("ringing");

            if (ringing) {
                // Recupera o som do alarme ou usa o som atual do dispositivo
                String alarmSound = changes.containsKey("alarmSound")
                        ? (String) changes.get("alarmSound")
                        : device.getAlarmSound();

                // Recupera o volume ou usa o volume atual do dispositivo
                int volume = changes.containsKey("volume")
                        ? ((Number) changes.get("volume")).intValue()
                        : device.getVolume();

                // Atualiza o dispositivo com os valores fornecidos
                device.setRinging(true);
                device.setState(true); // Garante que o estado seja ligado
                device.setAlarmSound(alarmSound);
                device.setVolume(volume);

                System.out.println("Clock alarm triggered with sound: " + alarmSound + " and volume: " + volume);

                // Agendar o desligamento automático após 30 segundos
                scheduler.schedule(() -> {
                    Device updatedDevice = deviceRepository.findById(device.getDeviceId()).orElse(null);
                    if (updatedDevice != null && updatedDevice.getRinging() && updatedDevice.getState()) {
                        updatedDevice.setRinging(false);
                        updatedDevice.setState(false);
                        deviceRepository.save(updatedDevice);
                        broadcastUpdate(updatedDevice);
                        System.out.println("Clock alarm automatically turned OFF after 30 seconds.");
                    }
                }, 30, TimeUnit.SECONDS);
            } else {
                // Desliga o alarme e o estado do relógio
                device.setRinging(false);
                device.setState(false); // Garante que o estado seja desligado
                System.out.println("Clock alarm turned OFF.");
            }

            // Salva as alterações no repositório
            deviceRepository.save(device);
            broadcastUpdate(device);
        } else {
            System.out.println("No ringing state provided for clock automation.");
        }
    }

    private void broadcastUpdate(Device device) {
        try {
            String deviceJson = new ObjectMapper().writeValueAsString(device);
            System.out.println("Broadcasting update: " + deviceJson);
            simpMessagingTemplate.convertAndSend("/topic/device-updates", deviceJson);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
