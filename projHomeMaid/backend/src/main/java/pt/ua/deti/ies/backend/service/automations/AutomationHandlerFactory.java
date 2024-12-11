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
    private final TVAutomationHandler TVAutomationHandler;
    private final LampAutomationHandler LampAutomationHandler;
    private final ClockAutomationHandler ClockAutomationHandler;
    private final AirConditionerAutomationHandler AirConditionerAutomationHandler;

    public AutomationHandlerFactory(CoffeeMachineAutomationHandler coffeeMachineAutomationHandler,
                                    ShutterAutomationHandler shutterAutomationHandler,
                                    SpeakerAutomationHandler speakerAutomationHandler,
                                    HeatedFloorsAutomationHandler heatedFloorsAutomationHandler,
                                    WashingMachineAutomationHandler washingMachineAutomationHandler,
                                    DryerMachineAutomationHandler dryerMachineAutomationHandler,
                                    TVAutomationHandler TVAutomationHandler,
                                    LampAutomationHandler LampAutomationHandler,
                                    ClockAutomationHandler ClockAutomationHandler,
                                    AirConditionerAutomationHandler AirConditionerAutomationHandler) {
        this.coffeeMachineAutomationHandler = coffeeMachineAutomationHandler;
        this.shutterAutomationHandler = shutterAutomationHandler;
        this.speakerAutomationHandler = speakerAutomationHandler;
        this.heatedFloorsAutomationHandler = heatedFloorsAutomationHandler;
        this.washingMachineAutomationHandler = washingMachineAutomationHandler;
        this.dryerMachineAutomationHandler = dryerMachineAutomationHandler;
        this.TVAutomationHandler = TVAutomationHandler;
        this.LampAutomationHandler = LampAutomationHandler;
        this.ClockAutomationHandler = ClockAutomationHandler;
        this.AirConditionerAutomationHandler = AirConditionerAutomationHandler;
    }

    public DeviceAutomationHandler getHandler(String deviceType) {
        switch (deviceType) {
            case "coffeeMachine":
                return coffeeMachineAutomationHandler;
            case "shutter":
                return shutterAutomationHandler;
            case "stereo":
                return speakerAutomationHandler;
            case "heatedFloor":
                return heatedFloorsAutomationHandler;
            case "washingMachine":
                return washingMachineAutomationHandler;
            case "dryerMachine":
                return dryerMachineAutomationHandler;
            case "television":
                return TVAutomationHandler;
            case "lamp":
                return LampAutomationHandler;
            case "clock":
                return ClockAutomationHandler;
            case "airConditioner":
                return AirConditionerAutomationHandler;
            default:
                throw new IllegalArgumentException("Unsupported device type: " + deviceType);
        }
    }
}
