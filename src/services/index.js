import _axios from "axios";

const axios = _axios.create({
  baseURL: "http://hapi.fhir.org/baseR4",
});

export const getPatients = (search) => {
  if (search !== undefined) {
    return axios.get(`/Patient?name=${search.patientName === undefined ? '' : search.patientName}&birthdate=${search.birthdate === undefined ? '' : search.birthdate}`);
  } else {
    return axios.get("/Patient");
  }
};

export const getPractitioners = () => {
  return axios.get("/Practitioner");
};
