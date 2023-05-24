// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.6;

contract TasksContract {
    
    uint256 public taskCounter = 0;

    constructor() {
        createTask("Example task", "Go to the market");
    }

    // events
    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    event TaskToggleDone(
        uint256 id,
        bool done
    );

    event TaskDeleted(
        uint256 id,
        bool _deleted
    );

    // structs
    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        bool _deleted;
        uint256 createdAt;
    }


    // functions
    mapping (uint256 id => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
        taskCounter++;
        tasks[taskCounter] = Task(taskCounter, _title, _description, false, false, block.timestamp);

        emit TaskCreated(
            tasks[taskCounter].id, 
            tasks[taskCounter].title, 
            tasks[taskCounter].description, 
            tasks[taskCounter].done, 
            tasks[taskCounter].createdAt
        );
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;

        emit TaskToggleDone(_task.id, _task.done);
    }

    function deleteTask(uint _id) public {
        Task memory _task = tasks[_id];
        _task._deleted = true;
        tasks[_id] = _task;

        emit TaskDeleted(_task.id, _task._deleted);
    }
}