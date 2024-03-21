import * as React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Box, Divider, Icon, IconButton, Paper, Stack, Table, TableBody, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { useDeepCompareEffectForMaps } from "@/libs/hooks/maps";
import Head from "next/head";
import { listenArea } from "@/libs/firebase/database/area";
import { type DataSnapshot } from "firebase/database";
import { listen } from "@/libs/firebase/database/sub-area";
import { listen as listenPlaces } from "@/libs/firebase/database/places";
import Loading from "@/components/loading/Loading";
import { useRouter } from "next/router";



const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const restrictionArea: google.maps.LatLngBoundsLiteral = {
  north: -7.635833662902257,
  east: 111.3645880614411,
  south: -7.658259446199271,
  west: 111.31754315793403,
}

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

type Props = {
  children?: React.ReactElement
}

type InfoState = {
  zoom?: number,
  center?: google.maps.LatLngLiteral,
  bounds?: google.maps.LatLngBoundsLiteral
}

export default function Maps({ children }: Props){
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(true);
  const minZoom = 15;
  const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(minZoom);
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat:  -7.652561,
    lng: 111.334419,
  });

  const [info, setInfo] = React.useState<InfoState>({})

  const onClick = (e: google.maps.MapMouseEvent) => {
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
    setInfo(prev => ({ ...prev, bounds: m.getBounds()?.toJSON() }));
  };

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 2000)
  }, [])

  function handleMarkerClick(id: string) {
    router.replace(`/maps/${id}`)
  }

  return (
    <>
      <Head>
        <title>Maps | Tambran Smart Urban Village</title>
      </Head>
      {
        loading && <Loading />
      }
      <Box display="flex" position="relative" width="100%" height="100%">
        {children}
        <Wrapper apiKey={process.env.MAP_API_KEY || ""} render={render}>
          <Map
            center={center}
            onClick={onClick}
            onIdle={onIdle}
            zoom={zoom}
            minZoom={minZoom}
            disableDefaultUI={true}
            style={{ flexGrow: "1", height: "100vh" }}
          >
            {/* Box Info */}
            {/* <InfoBox /> */}

            <TopRightControl />
            <BottomRightControl />

            {/* Area */}
            <MapArea />

            {/* Sub Area */}
            <MapSubArea />

            {/* Marker */}
            <HomeLocation onMarkerClick={handleMarkerClick} />

            <Marker position={{ lat: -7.6525597080062795, lng: 111.33671397979273 }} />
          </Map>
        </Wrapper>
      </Box>
    </>
  );
};

type MapProp = {
  map?: google.maps.Map
}

const InfoBox: React.FC<MapProp> = ({ map }) => {
  const [zoom, setZoom] = React.useState(map?.getZoom());
  const center = map?.getCenter()?.toJSON();
  const bounds = map?.getBounds()?.toJSON();

  React.useEffect(() => {
    if(map) {
      map.addListener("idle", () => {
        setZoom(map.getZoom()!)
      })

      return () => {
        google.maps.event.clearListeners(map, "idle")
      }
    }
  }, [map])

  return (
    <Box 
      p={2} 
      component={Paper} 
      elevation={2}
      sx={{ position: "absolute", top: 10, left: 10, minWidth: 180 }}>
        <Typography variant="h5" sx={{ fontSize: 20 }}>Info</Typography>
        <Divider sx={{ mb: 1 }} />
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>Zoom</TableCell>
              <TableCell>: {zoom}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Langtitude</TableCell>
              <TableCell>: {center?.lat}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Longitude</TableCell>
              <TableCell>: {center?.lng}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Bounds</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Utara</TableCell>
              <TableCell>: {bounds?.north}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Timur</TableCell>
              <TableCell>: {bounds?.east}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Selatan</TableCell>
              <TableCell>: {bounds?.south}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Barat</TableCell>
              <TableCell>: {bounds?.west}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
    </Box>
  )
}

const TopRightControl: React.FC<MapProp> = ({ map }) => {

  return (
    <Box sx={{
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 9999
    }}>
      <Stack direction="row" component={Paper} >
        <IconButton>
          <Icon className="material-symbols-rounded">
          settings
          </Icon>
        </IconButton>
      </Stack>
    </Box>
  )
}

const BottomRightControl: React.FC<MapProp> = ({ map }) => {

  return (
    <Box sx={{
      position: "absolute",
      bottom: 12,
      right: 10,
      zIndex: 9999
    }}>
      <Stack direction="row" spacing={1} component={Paper} >
        <IconButton onClick={() => map?.setZoom(map.getZoom()! + 1)}>
          <Icon className="material-symbols-rounded">
            add
          </Icon>
        </IconButton>
        <IconButton onClick={() => map?.setZoom(map.getZoom()! - 1)}>
          <Icon className="material-symbols-rounded">
            remove
          </Icon>
        </IconButton>
      </Stack>
    </Box>
  )
}

type HomeLocation = MapProp & {
  onMarkerClick: (id: string) => void,
}
const HomeLocation: React.FC<HomeLocation> = ({ map, onMarkerClick }) => {
  const [marker, setMarker] = React.useState<google.maps.marker.AdvancedMarkerElement[]>([])
  async function handleSuccess(snap: DataSnapshot) {
    if(!snap.exists()) {
      alert("Data tempat tidak ada")
      return
    }

    const { PinElement, AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    const data = Object.values(snap.val());
    
    const container: google.maps.marker.AdvancedMarkerElement[] = [];
    // @ts-ignore
    const zoom = map.getZoom()!
    for(const place of data) {
      const marker = new AdvancedMarkerElement({
        map: (zoom >= 18) ? map : null,
        // @ts-ignore
        position: { lat: place.location.lat, lng: place.location.lng }
      });

      marker.addListener("click", () => {
      // @ts-ignore
        onMarkerClick(place.id)
      });

      container.push(marker);
    }

    map?.addListener("zoom_changed", () => {
      const zoom = map.getZoom()
      for(const marker of container) {
        // @ts-ignore
        marker.map = (zoom >= 18) ? map : null
      }
    })

    setMarker(container)    
  }

  function handleFailure(err: Error) {
    console.error(err);
  }

  React.useEffect(() => {
    if(map) {
      const unsubscribe = listenPlaces(handleSuccess, handleFailure)

      return () => {
        unsubscribe();
        
      }
    }
  }, [map])

  return <></>
}

const MapArea: React.FC<MapProp> = ({ map }) => {
  const area = React.useRef<google.maps.Polygon>();

  function handleSuccess(snap: DataSnapshot) {
    if(!snap.exists()) {
      alert("Data Area tidak ada");
      return
    }

    if(map) {
      // @ts-ignore
      const data = Object.values(snap.val()).map(item => item.paths);
      
      area.current?.setPaths(data);
      area.current?.setEditable(false);
      area.current?.setMap(map);
      map.addListener("zoom_changed", () => {
        const zoom = map.getZoom() ?? 17
        if(zoom > 15) {
          area.current?.setMap(null);
        } else {
          area.current?.setMap(map);
        }
      })
    }
  }

  function handleFailure(error: Error) {
    console.error(error);
    alert("Tidak bisa mendapatkan data Area")
  }

  React.useEffect(() => {
    if(map) {
      const unsubscribe = listenArea(handleSuccess, handleFailure)
      area.current = new google.maps.Polygon({
        strokeColor: "#5356FF",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillOpacity: 0,
      })
  
      return () => {
        unsubscribe();
        area.current?.setMap(null);
      }
    }
  }, [map])

  return <></>
}

type LatLng = {
  lat: number,
  lng: number
}

type SubArea = {
  name: string,
  paths: LatLng[],
  color: string,
}

const MapSubArea: React.FC<MapProp> = ({ map }) => {
  const [subArea, setSubArea] = React.useState<google.maps.Polygon[]>([]);
  const [zoom, setZoom] = React.useState<number>();

  function handleSuccess(snap: DataSnapshot) {
    if(!snap.exists()) {
      return
    }

    // @ts-ignore
    const data = Object.values(snap.val()).map((item: SubArea) => {
      const subAreaInstance = new google.maps.Polygon({
        paths: item.paths,
        strokeColor: item.color,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: item.color,
        fillOpacity: 0.2,
      })

      return subAreaInstance
    }) as google.maps.Polygon[]

    setSubArea(data);
  }

  function handleFailure(err: Error) {
    console.error(err);    
  }

  React.useEffect(() => {
    if(map && zoom) {
      if(zoom >= 16 && zoom < 18) {
        subArea.forEach((item) => item.setMap(map))
      } else {
        subArea.forEach((item) => item.setMap(null))
      }
    }
  }, [map, zoom])

  React.useEffect(() => {
    if(map) {
      const unsubscribe = listen(handleSuccess, handleFailure);

      map.addListener("idle", () => {
        setZoom(map.getZoom()!)
      });

      return () => unsubscribe();
    }
  }, [map])

  return <></>
}

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
  google.maps.importLibrary("marker") 

  React.useEffect(() => {
    if (ref.current && !map) {
      console.log();
      const bounds = new google.maps.LatLngBounds(restrictionArea)

      const initMap = new window.google.maps.Map(ref.current, {
        restriction: {
          latLngBounds: bounds,
        },
        mapTypeId: "satellite",
        mapId: 'DEMO_MAP_ID'
      });

      initMap.addListener('mapcapabilities_changed', () => {
        const mapCapabilities = initMap.getMapCapabilities();
        
        if (!mapCapabilities.isAdvancedMarkersAvailable) {
          console.log("Advance Marker tidak bisa")
        }
      });

      setMap(initMap);
    }
  }, [ref, map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

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

const Marker: React.FC<google.maps.marker.AdvancedMarkerElementOptions> = ({ map, ...options }) => {
  const [marker, setMarker] = React.useState<google.maps.marker.AdvancedMarkerElement>();

  React.useEffect(() => {
    if (map) {
      addMaker()
      // console.log(google.maps.MarkerImage);
    }

  }, [map]);

  async function addMaker() {
    const { PinElement, AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    const img = document.createElement("img")
    img.src = "/images/home.svg";

    const pinElement = new PinElement({
      glyph: img,
    })

    const markerInstance = new AdvancedMarkerElement({
      ...options,
    })

    setMarker(markerInstance);
  }

  return null;
};