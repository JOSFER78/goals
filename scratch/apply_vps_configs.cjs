const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8', maxBuffer: 20 * 1024 * 1024 });
};

const script = `
set -e
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

echo "=== 1. CONFIGURING ANDROID LOCAL.PROPERTIES ==="
echo "sdk.dir=/home/ubuntu/Android/Sdk" > android/local.properties

echo "=== 2. UPDATING FIREBASE.JSON ==="
cat << 'EOF' > firebase.json
{
  "auth": {
    "providers": {
      "emailPassword": true,
      "googleSignIn": {
        "oAuthBrandDisplayName": "ÁNCORA",
        "supportEmail": "josferestudio@gmail.com",
        "authorizedRedirectUris": [
          "https://ancora-portal.web.app/__/auth/handler"
        ]
      }
    }
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "site": "ancora-portal",
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**/*.apk",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/vnd.android.package-archive"
          },
          {
            "key": "Content-Disposition",
            "value": "attachment; filename=\"ancora.apk\""
          },
          {
            "key": "Cache-Control",
            "value": "public, max-age=300, must-revalidate"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOF

echo "=== 3. UPDATING ANDROID/APP/BUILD.GRADLE ==="
cat << 'EOF' > android/app/build.gradle
apply plugin: 'com.android.application'

android {
    namespace = "com.ancora.health"
    compileSdk = rootProject.ext.compileSdkVersion
    defaultConfig {
        applicationId "com.ancora.health"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
             // Files and dirs to omit from the packaged assets dir, matching goals configuration
            ignoreAssetsPattern = '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~:downloads:*.apk:*.zip'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
    signingConfigs {
        debug {
            v1SigningEnabled true
            v2SigningEnabled true
        }
        release {
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

repositories {
    flatDir{
        dirs '../capacitor-cordova-android-plugins/src/main/libs', 'libs'
    }
}

dependencies {
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    implementation "androidx.appcompat:appcompat:$androidxAppCompatVersion"
    implementation "androidx.coordinatorlayout:coordinatorlayout:$androidxCoordinatorLayoutVersion"
    implementation "androidx.core:core-splashscreen:$coreSplashScreenVersion"
    implementation project(':capacitor-android')
    testImplementation "junit:junit:$junitVersion"
    androidTestImplementation "androidx.test.ext:junit:$androidxJunitVersion"
    androidTestImplementation "androidx.test.espresso:espresso-core:$androidxEspressoCoreVersion"
    implementation project(':capacitor-cordova-android-plugins')
}

apply from: 'capacitor.build.gradle'

try {
    def servicesJSON = file('google-services.json')
    if (servicesJSON.text) {
        apply plugin: 'com.google.gms.google-services'
    }
} catch(Exception e) {
    logger.info("google-services.json not found, google-services plugin not applied. Push Notifications won't work")
}
EOF

echo "=== 4. UPDATING UPDATESERVICE.JS AND VERSION.JSON ==="
cat << 'EOF' > public/version.json
{
  "version": "1.0.0",
  "name": "ÁNCORA",
  "apkUrl": "/ancora.apk",
  "bundleZipUrl": "/ancora.apk",
  "changelog": "Versión oficial compilada y firmada v1+v2 para instalación directa en Android.",
  "publishedAt": "2026-08-14T22:15:00.000Z"
}
EOF

`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
