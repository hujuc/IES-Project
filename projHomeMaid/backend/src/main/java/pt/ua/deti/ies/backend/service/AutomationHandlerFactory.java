package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Component;

@Component
public class AutomationHandlerFactory {

    private final CoffeeMachineAutomationHandler coffeeMachineAutomationHandler;
    private final ShutterAutomationHandler shutterAutomationHandler;

    public AutomationHandlerFactory(CoffeeMachineAutomationHandler coffeeMachineAutomationHandler,
                                    ShutterAutomationHandler shutterAutomationHandler) {
        this.coffeeMachineAutomationHandler = coffeeMachineAutomationHandler;
        this.shutterAutomationHandler = shutterAutomationHandler;
    }

    public DeviceAutomationHandler getHandler(String deviceType) {
        switch (deviceType) {
            case "coffee machine":
                return coffeeMachineAutomationHandler;
            case "shutter":
                return shutterAutomationHandler;
            default:
                throw new IllegalArgumentException("Unsupported device type: " + deviceType);
        }
    }
}
