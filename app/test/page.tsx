"use client";

import { useEffect } from "react";

export default function TestAR() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://aframe.io/releases/1.6.0/aframe.min.js";
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src =
      "https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js";
    script2.async = true;
    document.head.appendChild(script2);

    const script3 = document.createElement("script");
    script3.src =
      "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js";
    script3.async = true;
    document.head.appendChild(script3);
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <a-scene
            embedded
            arjs="sourceType: webcam; gpsMinAccuracy: 100;"
          >
            <a-text
              value="Jalan depan rumah"
              gps-entity-place="latitude: 3.818342; longitude: 103.299370;"
              look-at="[gps-camera]"
              scale="10 10 10"
              position="0 2 0"
              color="white"
            ></a-text>

            <a-camera gps-camera rotation-reader gpsTimeInterval="1000"></a-camera>
          </a-scene>
        `,
      }}
    />
  );
}
