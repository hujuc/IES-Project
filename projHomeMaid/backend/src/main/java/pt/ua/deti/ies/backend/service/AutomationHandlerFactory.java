package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;

@Component
public class AutomationHandlerFactory {

    private final CoffeeMachineAutomationHandler coffeeMachineAutomationHandler;
    private final ShutterAutomationHandler shutterAutomationHandler;
    private final SpeakerAutomationHandler speakerAutomationHandler;

    public AutomationHandlerFactory(CoffeeMachineAutomationHandler coffeeMachineAutomationHandler,
                                    ShutterAutomationHandler shutterAutomationHandler,
                                    SpeakerAutomationHandler speakerAutomationHandler) {
        this.coffeeMachineAutomationHandler = coffeeMachineAutomationHandler;
        this.shutterAutomationHandler = shutterAutomationHandler;
        this.speakerAutomationHandler = speakerAutomationHandler;
    }

    public DeviceAutomationHandler getHandler(String deviceType) {
        switch (deviceType) {
            case "coffeeMachine":
                return coffeeMachineAutomationHandler;
            case "shutter":
                return shutterAutomationHandler;
            case "speaker":
                return speakerAutomationHandler;
            default:
                throw new IllegalArgumentException("Unsupported device type: " + deviceType);
        }
    }
}
