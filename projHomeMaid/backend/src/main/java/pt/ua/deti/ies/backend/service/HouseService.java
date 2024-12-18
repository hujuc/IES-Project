package pt.ua.deti.ies.backend.service;

import org.springframework.stereotype.Service;
import pt.ua.deti.ies.backend.model.House;
import pt.ua.deti.ies.backend.model.Room;
import pt.ua.deti.ies.backend.model.Device;
import pt.ua.deti.ies.backend.model.Sensor;
import pt.ua.deti.ies.backend.repository.HouseRepository;
import pt.ua.deti.ies.backend.repository.RoomRepository;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import pt.ua.deti.ies.backend.model.User;

import java.util.*;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HouseService {

    private final HouseRepository houseRepository;
    private final RoomRepository roomRepository;
    private final DeviceService deviceService;
    private final RoomService roomService;
    private final SensorService sensorService;

    public HouseService(HouseRepository houseRepository, RoomRepository roomRepository,
                        DeviceService deviceService,
                        RoomService roomService, SensorService sensorService) {
        this.houseRepository = houseRepository;
        this.roomRepository = roomRepository;
        this.deviceService = deviceService;
        this.roomService = roomService;
        this.sensorService = sensorService;
    }

    public boolean userHasAccessToHouse(User user, String houseId) {
        return houseId.equals(user.getHouseId());
    }


    public Optional<House> getHouseById(String id) {
        return houseRepository.findById(id);
    }

    public List<Room> getRoomsByIds(List<String> roomIds) {
        return roomRepository.findAllById(roomIds);
    }

    public House saveHouse(House house) {
        return houseRepository.save(house);
    }

    private String getHouseIdByDeviceId(String deviceId) {
        return houseRepository.findAll().stream()
                .filter(house -> house.getDevices().contains(deviceId))
                .map(House::getHouseId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("[ERROR] Casa associada ao dispositivo não encontrada."));
    }

    public House createHouseWithRoomsAndDevices(String houseId) {
        List<String> roomTypes = List.of(
                "hall", "masterBedroom", "guestBedroom", "kitchen",
                "livingRoom", "bathroom", "office", "laundry"
        );

        List<String> roomIds = new ArrayList<>();
        List<String> deviceIds = new ArrayList<>();

        for (String roomType : roomTypes) {
            String roomId = roomType + "_" + houseId;

            List<Device> devices = createDevicesForRoom(roomType, houseId);

            List<String> savedDeviceIds = new ArrayList<>();
            for (Device device : devices) {
                Device savedDevice = deviceService.createDevice(device);
                savedDeviceIds.add(savedDevice.getDeviceId());
            }

            createSensorsForRoom(roomId, houseId);

            Room room = new Room(roomId, savedDeviceIds, roomType);
            roomService.saveRoom(room);

            roomIds.add(roomId);
            deviceIds.addAll(savedDeviceIds);
        }

        House house = new House(houseId, roomIds, deviceIds);
        return houseRepository.save(house);
    }

    private List<Device> createDevicesForRoom(String roomType, String houseId) {
        List<Device> devices = new ArrayList<>();

        switch (roomType) {
            case "hall":
                Device hallHeatedFloor = new Device("heatedFloor_" + roomType + "_" + houseId, "heatedFloor");
                hallHeatedFloor.setName("Hall Heated Floor");
                hallHeatedFloor.setTemperature(10.0);
                devices.add(hallHeatedFloor);

                Device hallClock = new Device("clock_" + roomType + "_" + houseId, "clock");
                hallClock.setName("Hall Clock");
                hallClock.setRinging(false);
                hallClock.setAlarmSound("sound1");
                devices.add(hallClock);

                Device hallLamp = new Device("lamp_" + roomType + "_" + houseId, "lamp");
                hallLamp.setName("Hall Ceiling Lamp");
                hallLamp.setBrightness(1);
                hallLamp.setColor("#FFFFFF");
                devices.add(hallLamp);

                Device hallShutter = new Device("shutter_" + roomType + "_" + houseId, "shutter");
                hallShutter.setName("Hall Shutter");
                hallShutter.setOpenPercentage(0);
                devices.add(hallShutter);

                break;

            case "masterBedroom":
                Device masterBedroomShutter = new Device("shutter_" + roomType + "_" + houseId, "shutter");
                masterBedroomShutter.setName("Master Bedroom Shutter");
                masterBedroomShutter.setOpenPercentage(0);
                devices.add(masterBedroomShutter);

                Device masterBedroomHeatedFloor = new Device("heatedFloor_" + roomType + "_" + houseId, "heatedFloor");
                masterBedroomHeatedFloor.setName("Master Bedroom Heated Floor");
                masterBedroomHeatedFloor.setTemperature(10.0);
                devices.add(masterBedroomHeatedFloor);

                Device masterBedroomTelevision = new Device("television_" + roomType + "_" + houseId, "television");
                masterBedroomTelevision.setName("Master Bedroom Television");
                masterBedroomTelevision.setVolume(0);
                masterBedroomTelevision.setBrightness(10);
                devices.add(masterBedroomTelevision);

                Device masterBedroomCLamp = new Device("ceilingLamp_" + roomType + "_" + houseId, "lamp");
                masterBedroomCLamp.setName("Master Bedroom Ceiling Lamp");
                masterBedroomCLamp.setBrightness(1);
                masterBedroomCLamp.setColor("#FFFFFF");
                devices.add(masterBedroomCLamp);

                Device masterBedroomRLamp = new Device("readingLamp_" + roomType + "_" + houseId, "lamp");
                masterBedroomRLamp.setName("Master Bedroom Reading Lamp");
                masterBedroomRLamp.setBrightness(1);
                masterBedroomRLamp.setColor("#FFFFFF");
                devices.add(masterBedroomRLamp);

                Device masterBedroomClock = new Device("clock_" + roomType + "_" + houseId, "clock");
                masterBedroomClock.setName("Master Bedroom Clock");
                masterBedroomClock.setRinging(false);
                masterBedroomClock.setAlarmSound("sound1");
                devices.add(masterBedroomClock);

                Device masterBedroomAirConditioner = new Device("airConditioner_" + roomType + "_" + houseId, "airConditioner");
                masterBedroomAirConditioner.setName("Master Bedroom Air Conditioner");
                masterBedroomAirConditioner.setTemperature(12.0);
                masterBedroomAirConditioner.setMode("hot");
                masterBedroomAirConditioner.setAirFluxDirection("down");
                masterBedroomAirConditioner.setAirFluxRate("low");
                devices.add(masterBedroomAirConditioner);

                break;

            case "guestBedroom":
                Device guestBedroomShutter = new Device("shutter_" + roomType + "_" + houseId, "shutter");
                guestBedroomShutter.setName("Guest Bedroom Shutter");
                guestBedroomShutter.setOpenPercentage(0);
                devices.add(guestBedroomShutter);

                Device guestBedroomHeatedFloor = new Device("heatedFloor_" + roomType + "_" + houseId, "heatedFloor");
                guestBedroomHeatedFloor.setName("Hall Heated Floor");
                guestBedroomHeatedFloor.setTemperature(10.0);
                devices.add(guestBedroomHeatedFloor);

                Device guestBedroomCLamp = new Device("ceilingLamp_" + roomType + "_" + houseId, "lamp");
                guestBedroomCLamp.setName("Guest Bedroom Ceiling Lamp");
                guestBedroomCLamp.setBrightness(1);
                guestBedroomCLamp.setColor("#FFFFFF");
                devices.add(guestBedroomCLamp);

                Device guestBedroomRLamp = new Device("readingLamp_" + roomType + "_" + houseId, "lamp");
                guestBedroomRLamp.setName("Guest Bedroom Reading Lamp");
                guestBedroomRLamp.setBrightness(1);
                guestBedroomRLamp.setColor("#FFFFFF");
                devices.add(guestBedroomRLamp);

                Device guestBedroomClock = new Device("clock_" + roomType + "_" + houseId, "clock");
                guestBedroomClock.setName("Guest Bedroom Clock");
                guestBedroomClock.setRinging(false);
                guestBedroomClock.setAlarmSound("sound1");
                devices.add(guestBedroomClock);

                Device guestBedroomAirConditioner = new Device("airConditioner_" + roomType + "_" + houseId, "airConditioner");
                guestBedroomAirConditioner.setName("Guest Bedroom Air Conditioner");
                guestBedroomAirConditioner.setTemperature(12.0);
                guestBedroomAirConditioner.setMode("hot");
                guestBedroomAirConditioner.setAirFluxDirection("down");
                guestBedroomAirConditioner.setAirFluxRate("low");
                devices.add(guestBedroomAirConditioner);

                break;

            case "kitchen":
                Device kitchenCoffeeMachine = new Device("coffeeMachine_" + roomType + "_" + houseId, "coffeeMachine");
                kitchenCoffeeMachine.setName("Kitchen Coffee Machine");
                kitchenCoffeeMachine.setDrinkType("tea");
                devices.add(kitchenCoffeeMachine);

                Device kitchenShutter = new Device("shutter_" + roomType + "_" + houseId, "shutter");
                kitchenShutter.setName("Kitchen Shutter");
                kitchenShutter.setOpenPercentage(0);
                devices.add(kitchenShutter);

                Device kitchenCLamp = new Device("ceilingLamp_" + roomType + "_" + houseId, "lamp");
                kitchenCLamp.setName("Kitchen Ceiling Lamp");
                kitchenCLamp.setBrightness(1);
                kitchenCLamp.setColor("#FFFFFF");
                devices.add(kitchenCLamp);

                Device kitchenClock = new Device("clock_" + roomType + "_" + houseId, "clock");
                kitchenClock.setName("Kitchen Clock");
                kitchenClock.setRinging(false);
                kitchenClock.setAlarmSound("sound1");
                devices.add(kitchenClock);

                break;

            case "livingRoom":
                Device livingRoomShutter = new Device("shutter_" + roomType + "_" + houseId, "shutter");
                livingRoomShutter.setName("Living Room Shutter");
                livingRoomShutter.setOpenPercentage(0);
                devices.add(livingRoomShutter);

                Device livingRoomStereo = new Device("stereo_" + roomType + "_" + houseId, "stereo");
                livingRoomStereo.setName("Living Room Stereo");
                livingRoomStereo.setVolume(0);
                devices.add(livingRoomStereo);

                Device livingroomTelevision = new Device("television_" + roomType + "_" + houseId, "television");
                livingroomTelevision.setName("Living Room Television");
                livingroomTelevision.setVolume(0);
                livingroomTelevision.setBrightness(10);
                devices.add(livingroomTelevision);

                Device livingRooHeatedFloor = new Device("heatedFloor_" + roomType + "_" + houseId, "heatedFloor");
                livingRooHeatedFloor.setName("Living Room Heated Floor");
                livingRooHeatedFloor.setTemperature(10.0);
                devices.add(livingRooHeatedFloor);

                Device livingRoomClock = new Device("clock_" + roomType + "_" + houseId, "clock");
                livingRoomClock.setName("Living Room Clock");
                livingRoomClock.setRinging(false);
                livingRoomClock.setAlarmSound("sound1");
                devices.add(livingRoomClock);

                Device livingRoomAirConditioner = new Device("airConditioner_" + roomType + "_" + houseId, "airConditioner");
                livingRoomAirConditioner.setName("Living Room Air Conditioner");
                livingRoomAirConditioner.setTemperature(12.0);
                livingRoomAirConditioner.setMode("hot");
                livingRoomAirConditioner.setAirFluxDirection("down");
                livingRoomAirConditioner.setAirFluxRate("low");
                devices.add(livingRoomAirConditioner);

                Device livingroomCLamp = new Device("ceilingLamp_" + roomType + "_" + houseId, "lamp");
                livingroomCLamp.setName("Living Room Ceiling Lamp");
                livingroomCLamp.setBrightness(1);
                livingroomCLamp.setColor("#FFFFFF");
                devices.add(livingroomCLamp);

                Device livingRoomRLamp = new Device("readingLamp_" + roomType + "_" + houseId, "lamp");
                livingRoomRLamp.setName("Living Room Reading Lamp");
                livingRoomRLamp.setBrightness(1);
                livingRoomRLamp.setColor("#FFFFFF");
                devices.add(livingRoomRLamp);

                break;

            case "bathroom":
                Device bathroomShutter = new Device("shutter_" + roomType + "_" + houseId, "shutter");
                bathroomShutter.setName("Bathroom Shutter");
                bathroomShutter.setOpenPercentage(0);
                devices.add(bathroomShutter);

                Device bathroomHeatedFloor = new Device("heatedFloor_" + roomType + "_" + houseId, "heatedFloor");
                bathroomHeatedFloor.setName("Bathroom Heated Floor");
                bathroomHeatedFloor.setTemperature(10.0);
                devices.add(bathroomHeatedFloor);

                Device bathroomCLamp = new Device("ceilingLamp_" + roomType + "_" + houseId, "lamp");
                bathroomCLamp.setName("Bathroom Ceiling Lamp");
                bathroomCLamp.setBrightness(1);
                bathroomCLamp.setColor("#FFFFFF");
                devices.add(bathroomCLamp);

                break;

            case "office":
                Device officeShutter = new Device("shutter_" + roomType + "_" + houseId, "shutter");
                officeShutter.setName("Office Shutter");
                officeShutter.setOpenPercentage(0);
                devices.add(officeShutter);

                Device officeHeatedFloor = new Device("heatedFloor_" + roomType + "_" + houseId, "heatedFloor");
                officeHeatedFloor.setName("Hall Heated Floor");
                officeHeatedFloor.setTemperature(10.0);
                devices.add(officeHeatedFloor);

                Device officeAirConditioner = new Device("airConditioner_" + roomType + "_" + houseId, "airConditioner");
                officeAirConditioner.setName("Office Air Conditioner");
                officeAirConditioner.setTemperature(12.0);
                officeAirConditioner.setMode("hot");
                officeAirConditioner.setAirFluxDirection("down");
                officeAirConditioner.setAirFluxRate("low");
                devices.add(officeAirConditioner);

                Device officeCLamp = new Device("ceilingLamp_" + roomType + "_" + houseId, "lamp");
                officeCLamp.setName("Office Ceiling Lamp");
                officeCLamp.setBrightness(1);
                officeCLamp.setColor("#FFFFFF");
                devices.add(officeCLamp);

                Device officeDLamp = new Device("deskLamp_" + roomType + "_" + houseId, "lamp");
                officeDLamp.setName("Office Desk Lamp");
                officeDLamp.setBrightness(1);
                officeDLamp.setColor("#FFFFFF");
                devices.add(officeDLamp);

                break;

            case "laundry":
                Device laundryCLamp = new Device("ceilingLamp_" + roomType + "_" + houseId, "lamp");
                laundryCLamp.setName("Laundry Ceiling Lamp");
                laundryCLamp.setBrightness(1);
                laundryCLamp.setColor("#FFFFFF");
                devices.add(laundryCLamp);

                Device laundryDryerMachine = new Device("dryerMachine_" + roomType + "_" + houseId, "dryerMachine");
                laundryDryerMachine.setName("Dryer Machine");
                laundryDryerMachine.setTemperature(50.0);
                laundryDryerMachine.setMode("gentleDry");
                devices.add(laundryDryerMachine);

                Device laundrtWasingMachine = new Device("washingMachine_" + roomType + "_" + houseId, "washingMachine");
                laundrtWasingMachine.setName("Washing Machine");
                laundrtWasingMachine.setTemperature(20.0);
                laundrtWasingMachine.setMode("gentleWash");
                devices.add(laundrtWasingMachine);

                break;
        }

        return devices;
    }

    private void createSensorsForRoom(String roomId, String houseId) {
        Sensor temperatureSensor = new Sensor(
                "temperatureSensor_" + roomId, roomId, houseId,
                "temperature", 20.0, "°C", "Temperature Sensor"
        );
        System.out.println("here");
        sensorService.saveSensor(temperatureSensor);

        Sensor humiditySensor = new Sensor(
                "humiditySensor_" + roomId, roomId, houseId,
                "humidity", 50.0, "%", "Humidity Sensor"
        );
        sensorService.saveSensor(humiditySensor);
    }

}
