import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { AddFriendModalSearchContent } from './AddFriendModalSearchContent'
import { AddFriendModalInfoContent } from './AddFriendModalInfoContent'

Modal.setAppElement('#root')

const tabs = {
  search: { name: 'Thêm bạn' },
  info: { name: 'Thông tin tài khoản' },
}

export const AddFriendModal = ({ isOpen, setIsOpen }) => {
  const closeModal = () => setIsOpen(false)
  const [modalTab, setModalTab] = useState(tabs.search)
  const [dataSearch, setDataSearch] = useState(null)

  useEffect(() => {
    if (dataSearch) {
      setModalTab(tabs.info)
    }else{
      setModalTab(tabs.search)
    }
  }, [dataSearch])
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      className="fixed inset-0 flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-4">
        {/* Modal Header */}
        <div className="flex items-center border-b border-gray-700 p-4">
          {modalTab === tabs.info && (
            <button
              onClick={() => setModalTab(tabs.search)}
              className="text-2xl font-bold hover:text-gray-400"
            >
              &larr;
            </button>
          )}
          <h2 className="w-full px-4 text-lg font-semibold">{modalTab.name}</h2>
          <button
            onClick={closeModal}
            className="text-2xl font-bold hover:text-gray-400"
          >
            &times;
          </button>
        </div>
        {modalTab == tabs.search ? (
          <AddFriendModalSearchContent
            onCancel={()=>setIsOpen(false)}
            onSearch={(data) => setDataSearch(data)}
          />
        ) : (
          <AddFriendModalInfoContent data={dataSearch}/>
        )}
      </div>
    </Modal>
  )
}
