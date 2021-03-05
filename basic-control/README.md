# Basic Control

The objective of this project is to provide an example for the basic steps required to access and
control a Roomba 960 via local control in your network using
[dorita980](https://github.com/koalazak/dorita980).

## Setup the Roomba

1. Install the `iRobot` app on your mobile device.
2. Setup your vacuum, connecting it to your wifi in the process.
3. Install the sdk globally for easy access:

   ```
   $ npm install -g dorita980
   ```

4. Get the ip addres of the vacuum by looking it up in your router config or by running:

   ```
   $ node findip.js
   ```

5. Get your blid (username) and password by executing:

   ```
   $ get-roomba-password <robotIP> 
   ```

## Use the CLI

```
$ node ./cli.js <Command> --ip <ip> --blid <blid> --password <password>
```

Where `Command` can be:

- mission: Gets the vacuums current "mission", i.e. what the vacuum is currently doing.
- start: Starts the cleaning process. Leads to `mission.cleanMissionStatus.cycle === 'quick'`
- clean: Also starts the cleaning process. Leads to `mission.cleanMissionStatus.cycle === 'clean'`
- **logrun**: Starts the cleaning process. Logs all position and mission information received from
  the vacuum into `logrun.txt`.

## Troubleshooting

- Sometimes commands are not received by the vacuum without an error.

## TODO

- Exactly what is the difference between the commands start and clean?
- Interpretation of the coordinates in `mission.pose`
- Handle commands not properly send or received by the vacuum.
    * Repeat until mission changes to desired state?
