// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VehicleHistory {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // -----------------------------
    // STRUCTURES
    // -----------------------------

    struct ServiceRecord {
        uint256 serviceDate;
        string description;
        address serviceCenter;
    }

    struct OwnershipRecord {
        address owner;
        uint256 transferredAt;
    }

    struct Vehicle {
        string vehicleId;
        string registrationNumber;
        string model;
        string manufacturer;
        address currentOwner;
        bool exists;
    }

    // -----------------------------
    // STORAGE
    // -----------------------------

    mapping(string => Vehicle) private vehicles;

    mapping(string => ServiceRecord[]) private serviceHistory;

    mapping(string => OwnershipRecord[]) private ownershipHistory;

    mapping(address => bool) public authorizedServiceCenters;

    // -----------------------------
    // EVENTS
    // -----------------------------

    event VehicleRegistered(
        string vehicleId,
        string registrationNumber,
        address owner
    );

    event OwnershipTransferred(
        string vehicleId,
        address previousOwner,
        address newOwner
    );

    event ServiceRecordAdded(
        string vehicleId,
        uint256 serviceDate,
        address serviceCenter
    );

    event ServiceCenterAuthorized(
        address serviceCenter
    );

    // -----------------------------
    // MODIFIERS
    // -----------------------------

    modifier onlyAdmin() {
        require(
            msg.sender == admin,
            "Only admin can perform this action"
        );
        _;
    }

    modifier vehicleExists(string memory vehicleId) {
        require(
            vehicles[vehicleId].exists,
            "Vehicle does not exist"
        );
        _;
    }

    // -----------------------------
    // ADMIN FUNCTIONS
    // -----------------------------

    function authorizeServiceCenter(
        address serviceCenter
    ) external onlyAdmin {

        require(
            serviceCenter != address(0),
            "Invalid service center address"
        );

        authorizedServiceCenters[serviceCenter] = true;

        emit ServiceCenterAuthorized(serviceCenter);
    }

    function registerVehicle(
        string memory vehicleId,
        string memory registrationNumber,
        string memory model,
        string memory manufacturer,
        address owner
    ) external onlyAdmin {

        require(
            bytes(vehicleId).length > 0,
            "Vehicle ID required"
        );

        require(
            !vehicles[vehicleId].exists,
            "Vehicle already registered"
        );

        require(
            owner != address(0),
            "Invalid owner address"
        );

        vehicles[vehicleId] = Vehicle({
            vehicleId: vehicleId,
            registrationNumber: registrationNumber,
            model: model,
            manufacturer: manufacturer,
            currentOwner: owner,
            exists: true
        });

        ownershipHistory[vehicleId].push(
            OwnershipRecord({
                owner: owner,
                transferredAt: block.timestamp
            })
        );

        emit VehicleRegistered(
            vehicleId,
            registrationNumber,
            owner
        );
    }

    // -----------------------------
    // OWNERSHIP TRANSFER
    // -----------------------------

    function transferOwnership(
        string memory vehicleId,
        address newOwner
    )
        external
        vehicleExists(vehicleId)
    {

        require(
            msg.sender == vehicles[vehicleId].currentOwner,
            "Only current owner can transfer ownership"
        );

        require(
            newOwner != address(0),
            "Invalid new owner"
        );

        address previousOwner =
            vehicles[vehicleId].currentOwner;

        vehicles[vehicleId].currentOwner = newOwner;

        ownershipHistory[vehicleId].push(
            OwnershipRecord({
                owner: newOwner,
                transferredAt: block.timestamp
            })
        );

        emit OwnershipTransferred(
            vehicleId,
            previousOwner,
            newOwner
        );
    }

    // -----------------------------
    // SERVICE RECORD
    // -----------------------------

    function addServiceRecord(
        string memory vehicleId,
        string memory description
    )
        external
        vehicleExists(vehicleId)
    {

        require(
            authorizedServiceCenters[msg.sender],
            "Not an authorized service center"
        );

        require(
            bytes(description).length > 0,
            "Service description required"
        );

        serviceHistory[vehicleId].push(
            ServiceRecord({
                serviceDate: block.timestamp,
                description: description,
                serviceCenter: msg.sender
            })
        );

        emit ServiceRecordAdded(
            vehicleId,
            block.timestamp,
            msg.sender
        );
    }

    // -----------------------------
    // GET VEHICLE DETAILS
    // -----------------------------

    function getVehicleDetails(
        string memory vehicleId
    )
        external
        view
        vehicleExists(vehicleId)
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            address
        )
    {

        Vehicle memory vehicle =
            vehicles[vehicleId];

        return (
            vehicle.vehicleId,
            vehicle.registrationNumber,
            vehicle.model,
            vehicle.manufacturer,
            vehicle.currentOwner
        );
    }

    // -----------------------------
    // GET SERVICE HISTORY
    // -----------------------------

    function getServiceHistory(
        string memory vehicleId
    )
        external
        view
        vehicleExists(vehicleId)
        returns (
            ServiceRecord[] memory
        )
    {

        return serviceHistory[vehicleId];
    }

    // -----------------------------
    // GET OWNERSHIP HISTORY
    // -----------------------------

    function getOwnershipHistory(
        string memory vehicleId
    )
        external
        view
        vehicleExists(vehicleId)
        returns (
            OwnershipRecord[] memory
        )
    {

        return ownershipHistory[vehicleId];
    }

    // -----------------------------
    // CHECK VEHICLE
    // -----------------------------

    function vehicleExistsCheck(
        string memory vehicleId
    )
        external
        view
        returns (bool)
    {
        return vehicles[vehicleId].exists;
    }
}