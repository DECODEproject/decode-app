package com.decodev2;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import android.os.Bundle;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {

    static String currentLocale;

    @Override
    protected String getMainComponentName() {
        return "decodev2";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MainActivity.currentLocale = getResources().getConfiguration().locale.toString();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);

        String locale = newConfig.locale.toString();
        if (!MainActivity.currentLocale.equals(locale)) {
            MainActivity.currentLocale = locale;
            final ReactInstanceManager instanceManager = getReactInstanceManager();
            instanceManager.recreateReactContextInBackground();
        }
    }
}
