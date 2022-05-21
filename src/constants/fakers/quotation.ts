import { COMMON_FIELD } from './common'

const LAT_LONG_FIELDS = {
  lat: COMMON_FIELD.LAT,
  lng: COMMON_FIELD.LNG
}

export const QUOTATION = {
  scheduleAt: COMMON_FIELD.CURRENT_TIME,
  deliveryBy: COMMON_FIELD.AFTER_1HR_CURRENT_TIME,
  stops: [
    {
      coordinates: LAT_LONG_FIELDS,
      address: COMMON_FIELD.PICKUP_ADDRESS
    },
    {
      coordinates: LAT_LONG_FIELDS,
      address: COMMON_FIELD.DROP_OFF_ADDRESS
    }
  ],
  location: COMMON_FIELD.LOCATION
}
