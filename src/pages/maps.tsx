import * as React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Box, Button, Paper, TextField } from "@mui/material";
import { useDeepCompareEffectForMaps } from "./libs/hooks/maps";
import Head from "next/head";
import { blue } from "@mui/material/colors";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const tambranArea: google.maps.LatLngLiteral[] = [
  { lat: -7.655460, lng: 111.330965 },
  { lat: -7.656021, lng: 111.331933 },
  { lat: -7.656260, lng: 111.332873 },
  { lat: -7.656260, lng: 111.332873 },
  { lat: -7.655882, lng: 111.333359 },
  { lat: -7.655834, lng: 111.334882 },
  // Skip
  { lat: -7.649242, lng: 111.334276 },
]

export default function App(){
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(17);
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: -7.650334,
    lng: 111.340535,
  });

  const onClick = (e: google.maps.MapMouseEvent) => {
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  return (
    <>
      <Head>
        <title>Maps | Tambran Smart Urban Village</title>
      </Head>
      <Box width={1} minHeight="100vh" backgroundColor={blue[50]}>
        <TextField
          id="color-picker"
          type="color"
          fullWidth />
      </Box>
      {/* <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <Wrapper apiKey={"YOUR_KEY"} render={render}>
          <Map
            center={center}
            onClick={onClick}
            onIdle={onIdle}
            zoom={zoom}
            minZoom={15}
            zoomControl={false}
            disableDefaultUI={true}
            isFractionalZoomEnabled={true}
            style={{ flexGrow: "1", height: "100vh" }}
          >
          </Map>
        </Wrapper>
      </div> */}
    </>
  );
};

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      const styledMap = [
        {
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]

      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-7.663390972557823, 111.32330389741963),
        new google.maps.LatLng(-7.639147014379218, 111.34553404573506)
      )

      const initMap = new window.google.maps.Map(ref.current, {
        restriction: {
          latLngBounds: bounds,
        },
        mapTypeId: "satellite",
      });
      setMap(initMap);

      const tambran = new window.google.maps.Polygon({
        paths: tambranArea,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: "#FF0000",
        fillOpacity: 0.1,
      });

      tambran.setMap(initMap);
    }
  }, [ref, map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};
