import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { singleOrder, orderState } from "../../state/orders";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Grid } from "@material-ui/core";
import axios from "axios";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Tooltip,
} from "react-leaflet";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    maxHeight: 500,
  },
  media: {
    height: 400,
  },
});

export default function SingleOrder({ match }) {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const order = useSelector((state) => state.orders.singleOrder);

  const cadete = useSelector((state) => state.users.user);
  const [coord, setCoord] = useState(/*[-26.8198, -65.2169]*/);
  const [carga, setCarga] = useState(false);

  useEffect(() => {
    dispatch(singleOrder(match.id)).then((res) => {
      let ordenes = res.payload;
      setCarga(true);
      return axios
        .get(
          `https://nominatim.openstreetmap.org/search?street=${ordenes.number}+${ordenes.street}&city=${ordenes.city}&state=${ordenes.province}&country=argentina&format=geocodejson`
        )
        .then((res) => {
          setCoord(res.data.features[0].geometry.coordinates);
        })
        .then(() => {
          return (
            axios
              .get(`http://localhost:8000/api/product/${match.orderNumber}`)

              .then((res) => setProducts(res.data.count))
              /* .then(() => {
            return axios.get(
              `https://nominatim.openstreetmap.org/search?street=${ordenes.number}+${ordenes.street}&city=${ordenes.city}&state=${ordenes.province}&country=argentina&format=geocodejson`
            );
          })
          .then((res) => {
            setCoord(res.data.features[0].geometry.coordinates);
          }) */
              .then(setCarga(false))
              /*  .then(() => {
            return axios.get(
              `https://nominatim.openstreetmap.org/search?street=${ordenes.number}${ordenes.street}&city=${ordenes.city}&state=${ordenes.province}&country=argentina&format=geocodejson`
            );
          })
          .then((res) => {
            console.log(res, "ACA ESTA LA RESPUESTA");
            setCoord(res.data.features[0].geometry.coordinates);
          });
      }) */
              .catch((err) => console.log(err))
          );
        });
    });
  }, []);


  const ChangeState = (state) => {
    const state2 = {
      cadeteId: cadete.id,
      state: state,
      orderNumber: order.orderNumber,
    };
    dispatch(orderState(state2)).then((order) => {
      if (order.payload.status !== "En camino") history.push("/cadete");
      else dispatch(singleOrder(match.id));
    });
  };

  return (
    <>
      <Card className={classes.root}>
        <CardActionArea>
          <CardContent>
            N° de Orden: {order.orderNumber}
            <h4>Productos</h4>
            {products &&
              products.map((product) => {
                return (
                  <Grid container spacing={2} key={product.id}>
                    <Grid item xs={10}>
                      {product.productName}
                    </Grid>
                    <Grid item xs={2}>
                      {"cant: " + product.count}
                    </Grid>
                  </Grid>
                );
              })}
            <Typography gutterBottom variant="h6" component="h3">
              {order.clientName + " " + order.clientLastName}
            </Typography>
            <Typography gutterBottom variant="h6" component="h3">
              {order.street +
                " " +
                order.number +
                " " +
                (order.complement ? order.complement : "")}{" "}
              <br />
              {"tel: " + order.clientPhone}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
            ></Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {order.status === "Pendiente" ? (
            <Button
              size="small"
              color="primary"
              onClick={() => ChangeState("En camino")}
            >
              TOMAR
            </Button>
          ) : order.status === "En camino" ? (
            <>
              <Button
                size="small"
                color="primary"
                onClick={() => ChangeState("Entregado")}
              >
                ENTREGADO
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() => ChangeState("Devuelto a sucursal")}
              >
                DEVUELTO A SUCURSAL
              </Button>
            </>
          ) : null}
        </CardActions>

        {!carga ? (
          <Grid container xs={12} alignItems="flex-start">
            <MapContainer
              center={coord && [coord[1], coord[0]]}
              zoom={15}
              scrollWheelZoom={true}
              className="leaflet-container"
            >
              <Circle
                center={coord && [coord[1], coord[0]]}
                pathOptions={{ fillColor: "blue" }}
                radius={200}
              >
                <Tooltip></Tooltip>
              </Circle>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </Grid>
        ) : null}
      </Card>
    </>
  );
}