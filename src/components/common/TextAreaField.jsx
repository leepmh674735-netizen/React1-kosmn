import React from 'react';

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 6,
  name,
  disabled = false,
  style = {}
}) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    ...style
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--bg-coffee)'
  };

  const textareaStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    border: error ? '1.5px solid var(--accent-rust)' : '1px solid var(--gray-300)',
    backgroundColor: 'var(--bg-milk)',
    color: 'var(--bg-coffee)',
    fontSize: '14px',
    outline: 'none',
    transition: 'var(--transition-fast)',
    minHeight: '150px',
    resize: 'vertical',
    lineHeight: '1.6'
  };

  const errorStyle = {
    color: 'var(--accent-rust)',
    fontSize: '12px',
    marginTop: '2px'
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        style={{ ...textareaStyle, backgroundColor: disabled ? 'var(--gray-100)' : 'var(--bg-milk)', cursor: disabled ? 'not-allowed' : 'text' }}
        className="custom-textarea-field"
      />
      {error && <span style={errorStyle}>{error}</span>}

      <style>{`
        .custom-textarea-field:focus {
          border-color: var(--primary-gold) !important;
          box-shadow: 0 0 0 3px rgba(217, 160, 91, 0.15);
        }
      `}</style>
    </div>
  );
}

export default TextAreaField;
