<template>
    <a-space>
      <a-select
        ref="select"
        v-model:value="value1"
        style="width: 120px"
        @focus="focus"
        @change="handleChange"
      >
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
        <a-select-option value="disabled" disabled>Disabled</a-select-option>
        <a-select-option value="Yiminghe">yiminghe</a-select-option>
      </a-select>
    </a-space>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
  import type { SelectProps } from 'ant-design-vue';
  const value1 = ref('lucy');
  const value2 = ref('lucy');
  const value3 = ref('lucy');
  const options1 = ref<SelectProps['options']>([
    {
      value: 'jack',
      label: 'Jack',
    },
    {
      value: 'lucy',
      label: 'Lucy',
    },
    {
      value: 'disabled',
      label: 'Disabled',
      disabled: true,
    },
    {
      value: 'yiminghe',
      label: 'Yiminghe',
    },
  ]);
  const options2 = ref<SelectProps['options']>([
    {
      value: 'lucy',
      label: 'Lucy',
    },
  ]);
  const options3 = ref<SelectProps['options']>([
    {
      value: 'lucy',
      label: 'Lucy',
    },
  ]);
  const focus = () => {
    console.log('focus');
  };
  
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  </script>
  
  