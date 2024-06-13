// DoctorList.js
import React from 'react';
import { useDoctors } from './useDoctors';

function DoctorList() {
    const { doctors, loading } = useDoctors();

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Doctor List</h2>
            <ul>
                {doctors.map(doctor => (
                    <li key={doctor.id}>{doctor.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default DoctorList;
