import React, { useMemo, useState } from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';

export default function SearchInput({ handleChange, ...props }) {
  const [searchTerm, setSearchTerm] = useState('');

  const debounceSearch = useMemo(() => {
    const loadOptions = (value) => {
      handleChange(value);
    };
    return debounce(loadOptions, 800);
  }, []);

  return (
    <Input
      value={searchTerm}
      onChange={(event) => {
        setSearchTerm(event.target.value);
        debounceSearch(event.target.value);
      }}
      prefix={<SearchOutlined />}
      style={{ width: 300 }}
      {...props}
    />
  );
}
