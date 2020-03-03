import React from "react";
import {
  TextField,
  CircularProgress
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { last } from "../functions/formHelper";
import HintWarning from "../UI/HintWarning";
import classes from '../index.css'

export default function AsyncAutocomplete({ fieldData, setFieldValue, error, value }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState(null);
  const [inputText, setInputText] = React.useState("");
  const loading = open && !options;

  let name = last(fieldData.path);

  React.useEffect(() => {
    let active = true;
    fieldData.getAsyncOptions(inputText || "").then(
      r => !!active && setOptions(r)
    )
    return () => {
      active = false;
    };
  }, [inputText, fieldData]);

  React.useEffect(() => {
    if (!open) {
      setOptions(null);
    }
  }, [open]);

  return (
    <div className={classes.flex} key={fieldData.title}>
      <HintWarning hint={fieldData.warning} isLeft isWarning />
      <Autocomplete
        // getOptionSelected={fieldData.getOptionSelected}
        id="autocomplete"
        getOptionLabel={fieldData.getOptionLabel}
        freeSolo={fieldData.freeSolo}
        options={options || []}
        loading={loading}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(_, val) => setFieldValue(name, val)}
        onInputChange={(_, val) => {
          setInputText(val);
          setOptions(null);
          setFieldValue(name, val);
        }}
        filterOptions={(options, { inputValue }) => options}
        value={value || ""}
        className={classes.flexGrow}
        disabled={fieldData.disabled}
        renderInput={params => (
          <TextField
            {...params}
            margin={"dense"}
            error={!!error}
            helperText={error}
            label={fieldData.title}
            fullWidth
            variant={fieldData.disabled ? "filled" : "outlined"}
            placeholder={fieldData.placeholder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
      />
      <HintWarning hint={fieldData.hint} />
    </div>
  );
}
