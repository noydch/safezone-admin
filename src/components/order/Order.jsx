import React from 'react'
import { Tabs } from 'antd'
import TableOrder from './TableOrder'
import TableOrderPaid from './TableOrderPaid'

const Order = () => {
  const items = [
    {
      key: '1',
      label: 'ລາຍການອໍເດີ້ລ່າສຸດ',
      children: <TableOrder />,
    },
    {
      key: '2',
      label: 'ອໍເດີທີ່ຊຳລະແລ້ວ',
      children: <TableOrderPaid />,
    },
  ]

  return (
    <div className='mt-5'>
      <h1 className='text-[18px] font-medium mb-1'>
        ລາຍການອໍເດີ້
      </h1>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default Order