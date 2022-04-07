import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import styled from "styled-components";
import { CheckSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";

function DropZone(props) {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
          const reader = new FileReader()
          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onload = () => {
          // Do whatever you want with the file contents
            let csvResult = reader.result;
            csvResult = csvResult.split(',' , 4); 
            csvResult = csvResult[1].split('\n', 2);
            csvResult = csvResult[1].replace(/\"/gi, "");
            
            props.setPrivatekey(csvResult);
          }
          reader.readAsText(file)
        });
    }, [])


    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        onDrop,
        accept: 'text/csv'
    });

    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map(e => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      ));

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));


  return (
    
  <DropContainer className="container">
    <DropForm {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
        <PlusSquareOutlined style={{ fontSize: "8rem" }}/>
      <div style={{ textAlign: "center"}}>Upload Your Keyfile</div>
    </DropForm>
  </DropContainer>
  )
}

export default DropZone

const DropContainer = styled.div`
    display: flex;
    flex-direction: column;

`;

const DropForm = styled.div`
    display: flex;
    width: 150px;
    flex-direction: column;
    border: 1px solid lightgray;
    padding: 15px;
    :hover{
        cursor: pointer;
    }


`