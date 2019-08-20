/*
 * DECODE App – A mobile app to control your personal data
 *
 * Copyright (C) 2019 – DRIBIA Data Research S.L.
 *
 * DECODE App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DECODE App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * email: info@dribia.com
 */
package decode.zenroom;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ZenroomModule extends ReactContextBaseJavaModule {

    static {
        try {
            System.loadLibrary("zenroom");
            System.out.println("Loaded zenroom native library");
        } catch (Throwable exc) {
            System.out.println("Could not load zenroom native library: " + exc.getMessage());
        }
    }

    private static final String E_ZENROOM = "E_ZENROOM";

    public ZenroomModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Zenroom";
    }

    @ReactMethod
    public void execute(String contract, String data, String key, Promise promise) {
        if (data == null) {
            data = "";
        }
        if (key == null) {
            key = "";
        }

        try {
            System.out.println("Before native zenroom.execute(contract, conf, key, data)");
            System.out.println("Contract: " + contract);
            System.out.println("Conf: ");
            System.out.println("Key: " + key);
            System.out.println("Data: " + data);
            String output = (new Zenroom()).execute(contract, "", key, data);
            System.out.println("Zenroom returns: " + output);
            promise.resolve(output);
        } catch (Exception e) {
            System.out.println("Error while calling native zenroom: " + e.getMessage());
            promise.reject(E_ZENROOM, e);
        }
    }
}
