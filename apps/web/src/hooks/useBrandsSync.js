
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useBrandsSync = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBrands = async () => {
      try {
        const records = await pb.collection('brands').getFullList({ 
          sort: 'name', 
          $autoCancel: false 
        });
        if (isMounted) {
          setBrands(records);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchBrands();

    pb.collection('brands').subscribe('*', (e) => {
      setBrands((prevBrands) => {
        let updatedBrands = [...prevBrands];
        
        if (e.action === 'create') {
          // Check if it already exists to prevent duplicates
          if (!updatedBrands.some(b => b.id === e.record.id)) {
            updatedBrands.push(e.record);
          }
        } else if (e.action === 'update') {
          updatedBrands = updatedBrands.map(b => b.id === e.record.id ? e.record : b);
        } else if (e.action === 'delete') {
          updatedBrands = updatedBrands.filter(b => b.id !== e.record.id);
        }
        
        return updatedBrands.sort((a, b) => a.name.localeCompare(b.name));
      });
    });

    return () => {
      isMounted = false;
      pb.collection('brands').unsubscribe('*');
    };
  }, []);

  return { brands, loading };
};
