# Mobile Testing Guide

This guide explains how to test the Lofts des Arts website on mobile devices within your local network.

## Prerequisites

- Your development machine and mobile device must be connected to the same Wi-Fi network
- The development server must be running with network access enabled
- Any firewall on your development machine must allow incoming connections on port 3000

## Setting Up the Development Server

1. Start the development server with network access using the following command:

```bash
npm run dev:network
```

This command starts the Next.js development server on all network interfaces (0.0.0.0) rather than just localhost, making it accessible to other devices on your network.

## Accessing the Site on Mobile

1. Find your computer's local IP address by running:

```bash
# On macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows
ipconfig
```

2. On your mobile device, open a web browser and navigate to:

```
http://10.0.0.116:3000
```

Replace `10.0.0.116` with your actual local IP address.

## Troubleshooting

### Can't connect to the server

1. **Check your IP address**: Make sure you're using the correct IP address for your development machine.

2. **Firewall issues**: Your computer's firewall might be blocking incoming connections. Check your firewall settings and allow connections on port 3000.

3. **Network restrictions**: Some networks (especially public or corporate Wi-Fi) might restrict device-to-device connections. Try using your home network.

4. **Check the server**: Ensure the development server is running with the `--hostname 0.0.0.0` flag.

### The site loads but doesn't work properly

1. **CORS issues**: If the site makes API calls, you might need to configure CORS to allow requests from different origins.

2. **Environment variables**: Make sure any environment variables needed for API integrations are properly set.

3. **Responsive design**: Mobile issues might be related to responsive design problems rather than network connectivity.

## Mobile Testing Best Practices

1. **Test on multiple devices**: If possible, test on both iOS and Android devices with different screen sizes.

2. **Check performance**: Mobile devices might have slower processors and less memory, so check for performance issues.

3. **Test touch interactions**: Make sure all interactive elements are large enough for touch and have appropriate touch feedback.

4. **Test in different orientations**: Check how the site looks and functions in both portrait and landscape orientations.

5. **Network conditions**: Consider testing under throttled network conditions to simulate mobile networks.

## Setting Up Chrome DevTools Remote Debugging

For more advanced debugging, you can use Chrome DevTools to debug your site running on an Android device:

1. On your Android device, enable USB debugging in Developer options.
2. Connect your device to your computer with a USB cable.
3. On your computer, open Chrome and navigate to `chrome://inspect`.
4. Find your device and the open tab with your site and click "inspect".

This allows you to use the full Chrome DevTools suite while testing on a real device. 