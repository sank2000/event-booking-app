import React, { useState } from 'react';

import { Modal } from '../../components';

export default function Events() {
  const [open, setOpen] = useState(false);

  return (
    <section className='page'>
      <h1>The Events Page</h1>;<button onClick={() => setOpen(true)}>Open</button>
      <Modal setIsOpen={setOpen} isOpen={open} CloseIcon title=''>
        <h1>Testing</h1>
      </Modal>
    </section>
  );
}
