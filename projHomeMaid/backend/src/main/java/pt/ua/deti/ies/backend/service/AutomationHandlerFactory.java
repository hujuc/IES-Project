package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;

@Component
public class AutomationHandlerFactory {

    private final CoffeeMachineAutomationHandler coffeeMachineAutomationHandler;
    private final ShutterAutomationHandler shutterAutomationHandler;
    private final SpeakerAutomationHandler speakerAutomationHandler;
    private final HeatedFloorsAutomationHandler heatedFloorsAutomationHandler;
    private final WashingMachineAutomationHandler washingMachineAutomationHandler;
    private final DryerMachineAutomationHandler dryerMachineAutomationHandler;

    public AutomationHandlerFactory(CoffeeMachineAutomationHandler coffeeMachineAutomationHandler,
                                    ShutterAutomationHandler shutterAutomationHandler,
                                    SpeakerAutomationHandler speakerAutomationHandler,
                                    HeatedFloorsAutomationHandler heatedFloorsAutomationHandler,
                                    WashingMachineAutomationHandler washingMachineAutomationHandler,
                                    DryerMachineAutomationHandler dryerMachineAutomationHandler) {
        this.coffeeMachineAutomationHandler = coffeeMachineAutomationHandler;
        this.shutterAutomationHandler = shutterAutomationHandler;
        this.speakerAutomationHandler = speakerAutomationHandler;
        this.heatedFloorsAutomationHandler = heatedFloorsAutomationHandler;
        this.washingMachineAutomationHandler = washingMachineAutomationHandler;
        this.dryerMachineAutomationHandler = dryerMachineAutomationHandler;
    }

    public DeviceAutomationHandler getHandler(String deviceType) {
        switch (deviceType) {
            case "coffeeMachine":
                return coffeeMachineAutomationHandler;
            case "shutter":
                return shutterAutomationHandler;
            case "speaker":
                return speakerAutomationHandler;
            case "heatedFloor":
                return heatedFloorsAutomationHandler;
                case "washingMachine":
                    return washingMachineAutomationHandler;
                    case "dryerMachine":
                        return dryerMachineAutomationHandler;
            default:
                throw new IllegalArgumentException("Unsupported device type: " + deviceType);
        }
    }
}
