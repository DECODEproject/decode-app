package com.dribia.decodeapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.os.Bundle;
import android.content.res.Configuration;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    static String currentLocale;

    @Override
    protected String getMainComponentName() {
        return "decode-app";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashTheme);
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

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
