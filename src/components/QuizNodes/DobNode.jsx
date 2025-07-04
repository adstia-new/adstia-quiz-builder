import React, { useState, useEffect } from 'react'
import './DobNode.css'

const DobNode = ({ data, setNextDisabled }) => {
  const fields = data.fields || [];
  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach(f => { initial[f.fieldName] = ''; });
    return initial;
  });
  const [errors, setErrors] = useState(() => {
    const initial = {};
    fields.forEach(f => { initial[f.fieldName] = ''; });
    return initial;
  });

  useEffect(() => {
    // Disable next if any error or required field is empty
    const hasError = Object.values(errors).some(Boolean);
    const hasEmpty = fields.some(f => f.validation?.required && !values[f.fieldName].trim());
    setNextDisabled(hasError || hasEmpty);
  }, [errors, values, setNextDisabled, fields]);

  const validate = (field, value) => {
    const v = field.validation || {};
    if (v.required && !value.trim()) {
      return 'This field is required';
    }
    if (v.pattern && value) {
      const regex = new RegExp(v.pattern);
      if (!regex.test(value)) {
        return v.errorMessage || 'Invalid value';
      }
    }
    if (v.minLength && value.length < v.minLength) {
      return `Minimum ${v.minLength} characters required`;
    }
    if (v.maxLength && value.length > v.maxLength) {
      return `Maximum ${v.maxLength} characters allowed`;
    }
    return '';
  };

  const handleChange = (field, e) => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, [field.fieldName]: value }));
    setErrors(prev => ({ ...prev, [field.fieldName]: '' }));
  };

  const handleBlur = (field, e) => {
    const value = e.target.value;
    const error = validate(field, value);
    setErrors(prev => ({ ...prev, [field.fieldName]: error }));
  };

  return (
    <div className="dob-node">
      <label className="dob-node__label">{data.inputLabel || 'Date of Birth'} <span className="dob-node__required">*</span></label>
      <div className="dob-node__fields">
        {fields.map(field => (
          <div className="dob-node__field" key={field.fieldName}>
            <input
              type={field.fieldType || 'text'}
              name={field.fieldName}
              placeholder={field.placeholder}
              className={`dob-node__input input ${errors[field.fieldName] ? 'dob-node__input--error' : ''}`}
              value={values[field.fieldName]}
              onChange={e => handleChange(field, e)}
              onBlur={e => handleBlur(field, e)}
              maxLength={field.validation?.maxLength}
            />
            {errors[field.fieldName] && <span className="dob-node__error">{errors[field.fieldName]}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DobNode