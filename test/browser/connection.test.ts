import {test} from "vitest";
import {BrowserWebSocketConnection} from "../../src/index.browser";
import {WS_TOKEN, WS_URL} from "../constants";

test('Connect to server', async () => {
    const connection = await BrowserWebSocketConnection.connect(WS_URL, WS_TOKEN);
    connection.close();
});
