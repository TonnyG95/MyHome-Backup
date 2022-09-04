import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import Axios from 'axios'

// React Leaflet
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

// Map Icons

import houseIconPng from "./Assets/Mapicons/house.png";
import apartmentIconPng from "./Assets/Mapicons/apartment.png";
import officeIconPng from "./Assets/Mapicons/office.png";

// Assets
import img1 from "./Assets/img1.jpg";
import myListings from "./Assets/Data/Dummydata";

// Components

import Cards from "./Cards";

function Listings() {

  // fetch('https://8000-tonnyg95-myhome-2864quj0ulx.ws-eu63.gitpod.io/api/listings/').then(response => response.json()).then(data => console.log(data))



  const houseIcon = new Icon({
		iconUrl: houseIconPng,
		iconSize: [40, 40],
	});

	const apartmentIcon = new Icon({
		iconUrl: apartmentIconPng,
		iconSize: [40, 40],
	});

	const officeIcon = new Icon({
		iconUrl: officeIconPng,
		iconSize: [40, 40],
	});
  

	const [latitude, setLatitude] = useState(53.34981323250131);
	const [longitude, setLongitude] = useState(-6.260253122638746);

  const [allListings, setAllListings] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true)

  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function GetAllListings() {
      try {
        const response = await Axios.get('https://8000-tonnyg95-myhome-2864quj0ulx.ws-eu63.gitpod.io/api/listings/', {cancelToken: source.token})
        setAllListings(response.data)
        setDataIsLoading(false) 
      } catch(error){
        console.log(error.response)
      }
    }
    GetAllListings();
    return ()=>{
      source.cancel();
    }
  },[])
 
  if (dataIsLoading === false ){
    console.log(allListings)
  }

  if (dataIsLoading === true ){
    return  <div className="container text-center my-5 p-4"> <Spinner animation="border" /></div>;
  }

  return (
    <Row className='text-center'>
      <Col className="bg-dark text-light text-center py-5" xs={12} md={2} lg={2} xl={2}> 
       <div className="listings-container">
      <Cards />
      </div> 
       </Col>


      <Col className="position-sticky" xs={12} md={10} lg={10} xl={10}>
      <div style={{height: '100vh'}}>
      <MapContainer center={[53.34981323250131, -6.260253122638746]} zoom={14} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {allListings.map((listing)=>{

          function IconDisplay(){
            if (listing.listing_type === 'House'){
              return houseIcon
            }
            else if (listing.listing_type === 'Apartment'){
              return apartmentIcon
            }
            else if (listing.listing_type === 'Office'){
              return officeIcon
            }
          }

          return (
            <Marker
            key={listing.id}
            icon={IconDisplay()}
            position={[listing.latitude, listing.longitude]}
            >
              <Popup>
                <h5>{listing.title}</h5>
                <img src={listing.picture1} alt={listing.title} style={{ height: "14rem", width: "18rem" }} />
                <p>{listing.description.substring(0, 200)}...</p>
              
                {listing.property_status === "Sale" ? (<h5>Price: {listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}€</h5> ) : (<h5>Price: {listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}€ / {listing.rental_frequency}</h5> )}
               

                <Link to='/'> <Button className="btn btn-primary mb-3">Visit Property</Button> </Link>
              </Popup>
            </Marker>
          );
        })}
 
         {/* <Marker position={[latitude, longitude]}>
          <Popup>
            <h5>Demo Property</h5>
            <img src={img1} style={{height: '14rem', width: '18rem'}}/>
            <p>Short description about the property</p>
            <Button className="btn btn-primary mb-3">Visit Property</Button>
          </Popup>
        </Marker>  */}
        
      </MapContainer>
    </div>

      </Col>
    </Row>
  );
}

export default Listings;
