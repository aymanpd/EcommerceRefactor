import React from 'react'

const BasicProductFields = () => (
        <section className={styles.section}>
            <FormGroup>
                <Field name="name">
                    {(props) => (
                        <>
                            <FormLabel htmlFor='name'>name</FormLabel>
                            <FormControl id='name' as="input" type="text"  {...props.field} />
                        </>
                    )}
                </Field>
            </FormGroup>
            <FormGroup>
                <Field name="description">
                    {(props) => (
                        <>
                            <FormLabel htmlFor='description' >Description</FormLabel>
                            <FormControl id='description' as="input" type="text"  {...props.field} />
                        </>
                    )}
                </Field>
            </FormGroup>
            <FormGroup>
                <Field name="featured">
                    {(props) => (
                        <>
                            <FormLabel htmlFor="featured">Featured</FormLabel>
                            <FormControl id="featured" as="input" type="checkbox" checked={props.field.value}  {...props.field} />
                        </>
                    )}
                </Field>
            </FormGroup>
            <FormGroup>
                <Field name="regularPrice">
                    {(props) => (
                        <>
                            <FormLabel htmlFor="price">Price</FormLabel>
                            <FormControl id="price" as="input" type="number"  {...props.field} />
                        </>
                    )}
                </Field>
            </FormGroup>
            <FormGroup>
                <Field name="salePrice">
                    {(props) => (
                        <>
                            <FormLabel htmlFor="salePrice">sale price</FormLabel>
                            <FormControl id="salePrice" as="input" type="number"  {...props.field} />
                        </>
                    )}
                </Field>
            </FormGroup>
        </section>
                        {/* Colors */ }
    <section className={styles.section}>
        <FieldArray name="colors">
            {({ form, push }) => (
                <>
                    {form.values.colors.map((color, index) => (
                        <div key={index}> {/*color block*/}
                            <FormGroup>
                                <Field name={`colors[${index}].colorName`} >
                                    {(props) => (
                                        <>
                                            <FormLabel htmlFor={`colorName-${index}`}>{`#${index + 1} Color name`}</FormLabel>
                                            <FormControl id={`colorName-${index}`} as="input" type="text"  {...props.field} />
                                        </>
                                    )}
                                </Field>
                            </FormGroup>
                            {['xs', 's', 'm', 'l', 'xl'].map((size) => (
                                <FormGroup key={size}>
                                    <Field name={`colors[${index}].sizes.${size}`} >
                                        {(props) => (
                                            <>
                                                <FormLabel htmlFor={`${size}-${index}`}>{size.toUpperCase()}</FormLabel>
                                                <FormControl id={`${size}-${index}`} checked={form.values.colors[index].sizes[size]} as="input" type="checkbox"  {...props.field} />
                                            </>
                                        )}
                                    </Field>
                                </FormGroup>
                            ))}
                            <FormGroup>
                                <Field name={`colors[${index}].primaryImage`} >
                                    {(props) => (
                                        <>
                                            <FormLabel htmlFor={`primaryImage-${index}`}>Primary image</FormLabel>
                                            <FormControl id={`primaryImage-${index}`} as="input" type="file" accept={"image/*"} onChange={(e) => handleFileChange(e.target.files, props)} />
                                            {props.field.value && <img alt="no" src={props.field.value.buffer || props.field.value.link} />}

                                        </>
                                    )}
                                </Field>
                            </FormGroup>
                            <FormGroup>
                                <Field name={`colors[${index}].secondaryImage`} >
                                    {(props) => (
                                        <>
                                            <FormLabel htmlFor={`secondaryImage-${index}`}>Secondary image</FormLabel>
                                            <FormControl id={`secondaryImage-${index}`} as="input" type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files, props)} />
                                        </>
                                    )}
                                </Field>
                            </FormGroup>
                            <FormGroup>
                                <Field name={`colors[${index}].gallery`} >
                                    {(props) => (
                                        <>
                                            <FormLabel htmlFor={`secondaryImage-${index}`}>Secondary image</FormLabel>
                                            <FormControl id={`secondaryImage-${index}`} multiple={true} as="input" type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files, props)} />
                                        </>
                                    )}
                                </Field>
                            </FormGroup>
                        </div>
                    ))}
                    <button onClick={() => push(defaultInitialValues.colors[0])}>Add color</button>
                </>
            )}
        </FieldArray>
    </section>
    )

export default BasicProductFields
