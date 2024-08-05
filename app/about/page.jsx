'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

export default function InventoryList() {
  const [inventory, setInventory] = useState([])

  // Function to fetch inventory data from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await deleteDoc(docRef)
    }
    await updateInventory()
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop={4} // Add margin top
      width="100%"
    >
      <Stack width="90vw" height="auto" spacing={2} overflow={'visible'}>
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="90%" // Increased width for better fit
            minHeight="80px"
            display={'flex'}
            borderRadius={"10px"}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#E5A98C'}
            paddingX={3} // Adjusted padding for better spacing
            paddingY={2} // Added vertical padding for better appearance
            flexDirection={{ xs: 'column', sm: 'row' }} // Stack vertically on small screens
            textAlign="center" // Center text alignment
          >
            <Typography variant={'h5'} color={'black'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'h5'} color={'black'}>
              Quantity: {quantity}
            </Typography>
            <div style={{ display: 'flex', gap: '6px', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#C9725A', color: '#fff', padding: '6px 12px' }} // Adjust padding for smaller buttons
                onClick={() => removeItem(name)}
              >
                <Typography variant={'h6'}>-</Typography>
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#C9725A', color: '#fff', padding: '6px 12px' }} // Adjust padding for smaller buttons
                onClick={() => addItem(name)}
              >
                <Typography variant={'h6'}>+</Typography>
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#C9725A', color: '#fff', padding: '10px 12px' }} // Adjust padding for smaller buttons
                onClick={() => deleteItem(name)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                  alt="Delete"
                  style={{ width: '24px', height: '24px' }} // Adjust size as needed
                />
              </Button>
            </div>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
