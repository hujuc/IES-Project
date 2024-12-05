package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.repository.DeviceRepository;

import java.util.Map;

@Component
public class ClockAutomationHandler implements DeviceAutomationHandler {

    private final DeviceRepository deviceRepository;

    public ClockAutomationHandler(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
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
            } else {
                // Desliga o alarme e o estado do relógio
                device.setRinging(false);
                device.setState(false); // Garante que o estado seja desligado
                System.out.println("Clock alarm turned OFF.");
            }

            // Salva as alterações no repositório
            deviceRepository.save(device);
        } else {
            System.out.println("No ringing state provided for clock automation.");
        }
    }
}
