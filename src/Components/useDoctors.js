// useDoctors.js
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export const useDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            const { data, error } = await supabase
                .from('doctors')
                .select('*');

            if (error) {
                console.error(error);
            } else {
                setDoctors(data);
            }
            setLoading(false);
        };

        fetchDoctors();
    }, []);

    return { doctors, loading };
};
