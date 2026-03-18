
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useCategoriesSync = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const records = await pb.collection('categories').getFullList({ 
          sort: 'name', 
          $autoCancel: false 
        });
        if (isMounted) {
          setCategories(records);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    pb.collection('categories').subscribe('*', (e) => {
      setCategories((prevCategories) => {
        let updatedCategories = [...prevCategories];
        
        if (e.action === 'create') {
          if (!updatedCategories.some(c => c.id === e.record.id)) {
            updatedCategories.push(e.record);
          }
        } else if (e.action === 'update') {
          updatedCategories = updatedCategories.map(c => c.id === e.record.id ? e.record : c);
        } else if (e.action === 'delete') {
          updatedCategories = updatedCategories.filter(c => c.id !== e.record.id);
        }
        
        return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
      });
    });

    return () => {
      isMounted = false;
      pb.collection('categories').unsubscribe('*');
    };
  }, []);

  return { categories, loading };
};
