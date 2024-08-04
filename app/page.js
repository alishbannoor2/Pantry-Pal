'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Functions to manage the modal state
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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

  // Functions to handle adding and removing items
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
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // If the item exists, delete the entire document
      await deleteDoc(docRef);
    } else {
      console.log(`Item ${item} does not exist in the inventory.`);
    }

    await updateInventory();
  }


  // Filtered inventory based on search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}
        sx={{ backgroundColor: '#C08E47', '&:hover': { backgroundColor: '#A76B3D' } }}>
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2, width: '90%' }}
      />
      <Box border={'0px solid #333'}>
        <Box
          width="90vw"
          height="90px"
          bgcolor={'#26331A'}
          borderRadius={"10px"}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h4'} color={'white'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="80vw" height="300px" spacing={2} overflow={'visible'} marginTop={2} marginLeft={8}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="80vw"
              minHeight="80px"
              display={'flex'}
              borderRadius={"10px"}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#E5A98C'}
              paddingX={5}
            >
              <Typography variant={'h5'} color={'black'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'black'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button variant="contained"
                  style={{ backgroundColor: '#C9725A', color: '#fff' }}
                  onClick={() => removeItem(name)}>
                  <Typography variant={'h6'}>  - </Typography>
                </Button>
                <Button variant="contained"
                  style={{ backgroundColor: '#C9725A', color: '#fff' }}
                  onClick={() => addItem(name)}>
                  <Typography variant={'h6'}>  + </Typography>
                </Button>
                <Button variant="contained"
                  style={{ backgroundColor: '#C9725A', color: '#fff', padding: '11px 0' }}
                  onClick={() => deleteItem(name)}>
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
    </Box>
  )
}
