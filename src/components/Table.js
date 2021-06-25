import React, { Component } from 'react';
import { getPatients } from "../services";

class Table extends Component {

    // Initial State
    state = {
        patients: [],
        search: [{
            patientName: '',
            birthdate: ''
        }],
        isSearch: false,
        searchDate: ''
    };

    // Initial API call to get list of patient
    componentDidMount() {
        getPatients().then((res) => {
            this.setState({ patients: this.patientObj(res) });
        });
    }

    // Filter the result and create the array object of patient with their name, date of birth and gender
    patientObj = (response) => {
        return (response.data.entry || []).map((item) => {
            const name = item.resource.name || [];
            return {
                id: item.resource.id,
                gender: item.resource.gender || 'N/A',
                name: `${((name[0] || {}).given || []).join(" ")} ${(name[0] || {}).family || []
                    }`,
                dob: item.resource.birthDate || 'N/A',
            };
        });
    };

    // Update the search state value and input value
    onChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(prevState => ({
            search: {
                ...prevState.search,
                [name]: value
            }
        }));
    }

    // Validate the input box to take only alphabetic value
    onKeyPress(event) {
        return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) ? true : event.preventDefault();
    }

    // On submit returns the search result
    handleSubmit(event) {
        if (this.state.search.patientName !== undefined || this.state.search.birthdate !== undefined) {
            this.setState({ isSearch: true });

            this.setState({
                searchDate: new Date()
            })

            getPatients(this.state.search).then((res) => {
                this.setState({ patients: this.patientObj(res) });
            });
        }

    }

    // Format the date
    dateFormatter = (date) => {
        const weekDay = date.toLocaleString('en-us', { weekday: 'short' })
        const day = date.toLocaleString('en-us', { day: '2-digit' })
        const month = date.toLocaleString('en-us', { month: 'short' })
        const year = date.toLocaleString('en-us', { year: 'numeric' })
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${weekDay} ${day} ${month} ${year} at ${hours}:${minutes}:${seconds}`
    }

    render() {

        const { patients } = this.state;

        // Sort the patients by their date of birth from youngest to oldest
        patients.sort(function (dobOne, dobTwo) {
            return new Date(dobTwo.dob) - new Date(dobOne.dob);
        });

        return (

            <div className="wrapper">

                {/* Search Inputs */}
                <div className="patient-search">
                    <input
                        type="text"
                        name="patientName"
                        placeholder="First name or last name"
                        onKeyPress={event => this.onKeyPress(event)}
                        onChange={event => this.onChange(event)}
                    />
                    <input
                        type="date"
                        name="birthdate"
                        placeholder="yyyy/mm/dd"
                        onChange={event => this.onChange(event)}
                    />
                    <button onClick={event => this.handleSubmit(event)} className="search-btn">Search</button>
                </div>

                {
                    this.state.isSearch ?
                        <div className="search-result">
                            <strong>
                                Results as of {this.dateFormatter(this.state.searchDate)}
                            </strong>
                        </div> : null
                }

                {
                    patients.length === 0 ?
                        <b className="no-result">No records!</b> :

                        <table className="patient-table">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Date of Birth</th>
                                    <th>Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.id}>
                                        <td>{patient.name}</td>
                                        <td>{patient.dob}</td>
                                        <td>{patient.gender}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                }
            </div>
        );
    }
}

export default Table;
