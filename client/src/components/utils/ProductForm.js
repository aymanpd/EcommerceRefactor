import React from 'react'
import { Formik, Form, Field, FieldArray } from 'formik';
import { FormControl, FormGroup, FormLabel, Container, Accordion, Card, Button, Row, Col } from 'react-bootstrap'
import * as Yup from 'yup';
import readFileAsync from '../../utils/readFileAsync';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPlus } from '@fortawesome/free-solid-svg-icons';

import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './productForm.scss';

const productSchema = Yup.object().shape({
    name: Yup.string().required("is required"),
    description: Yup.string().required("is required"),
    category: Yup.number().required("is required"),
    regularPrice: Yup.number().required("is required"),
    salePrice: Yup.number(),
    colors: Yup.array().of(Yup.object().shape({
        colorName: Yup.string().required("is required"),
    }
    ))
})

//name, type, placeholder, default value
const basics = [
    ['name', 'text', ' Name', ""],
    ['description', 'date', 'Description', ""],
    ['featured', 'check', 'Featured', false],
    ['regularPrice', 'number', 'Price', ""],
    ['onSaleFrom', 'date', 'sale Starts ', ""],
    ['onSaleTo', 'date', 'Sale ends', ""],
    ['salePrice', 'number', 'Price after sale', ""],
    ['stockStatus', 'select', 'Stock status', ""],
    ['category', 'asyncSelect', 'Category', ""],
    ['similarProducts', 'asyncSelect', 'Status', ""]
]

const basicsDefaultValues = basics.reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[3] }), {});
const defaultInitialValues = {
    ...basicsDefaultValues,
    colors: [{ colorName: "", sizes: { xs: false, s: false, m: false, l: false, xl: false }, primaryImage: "", secondaryImage: "", gallery: [] }],
    specifications: [""]
};

const handleFileChange = (files, { form, field }) => {
    Promise.all(
        Array.from(files).map((file) => {
            return readFileAsync(file).then((fileBuffer) => {
                return { file: files[0], buffer: fileBuffer }
            })
        })).then((values) => {
            (values.length > 1 || field.name.indexOf('gallery') !== -1) ? form.setFieldValue(field.name, values) : form.setFieldValue(field.name, values[0]);
        });


}

const ProductForm = ({ initialValues = defaultInitialValues, onSubmit, actionName }) => {
    return (
        <Formik initialValues={initialValues} validationSchema={productSchema} onSubmit={console.log}>
            {({ isSubmitting }) => (
                <Form>
                    <Container>
                        {/* Basics */}
                        <section>
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link">
                                            Basics
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse>
                                        <>
                                            <FormGroup className="text">
                                                <Field name="name">
                                                    {(props) => (
                                                        <>
                                                            <FormControl placeholder="Name" id='name' as="input" type="text"  {...props.field} />
                                                            <FormLabel htmlFor='name'>Name</FormLabel>
                                                        </>
                                                    )}
                                                </Field>
                                            </FormGroup>
                                            <FormGroup className="text">
                                                <Field name="description">
                                                    {(props) => (
                                                        <>
                                                            <FormControl placeholder="Description" id='description' as="input" type="text"  {...props.field} />
                                                            <FormLabel htmlFor='Description' >Description</FormLabel>
                                                        </>
                                                    )}
                                                </Field>
                                            </FormGroup>
                                            <FormGroup className="check">
                                                <Field name="featured">
                                                    {(props) => (
                                                        <>
                                                            <FormControl id="featured" as="input" type="checkbox" checked={props.field.value}  {...props.field} />
                                                            <FormLabel htmlFor="featured">Featured</FormLabel>
                                                        </>
                                                    )}
                                                </Field>
                                            </FormGroup>
                                            <FormGroup className="text number">
                                                <Field name="regularPrice">
                                                    {(props) => (
                                                        <>
                                                            <FormControl placeholder="Price" id="price" as="input" type="number"  {...props.field} />
                                                            <FormLabel htmlFor="price">Price</FormLabel>
                                                        </>
                                                    )}
                                                </Field>
                                            </FormGroup>
                                            <FormGroup>
                                                <Field name="onSaleFrom">
                                                    {({ field, form }) => (
                                                        <>
                                                            <FormLabel>On sale from</FormLabel>
                                                            <ReactDatePicker
                                                                selected={field.value}
                                                                onChange={(date) => form.setFieldValue(field.name, date)}
                                                                selectsStart
                                                                startDate={field.value}
                                                                endDate={form.values.onSaleTo}
                                                            />
                                                        </>
                                                    )}
                                                </Field>
                                            </FormGroup>
                                            <FormGroup>
                                                <Field name="onSaleTo">
                                                    {({ field, form }) => (
                                                        <>
                                                            <FormLabel>On sale To</FormLabel>
                                                            <ReactDatePicker
                                                                selected={field.value}
                                                                onChange={(date) => form.setFieldValue(field.name, date)}
                                                                startDate={form.values.onSaleFrom}
                                                                endDate={field.value}
                                                                minDate={form.values.onSaleFrom}
                                                            />
                                                        </>
                                                    )}
                                                </Field>
                                            </FormGroup>
                                            <FormGroup className="text number">
                                                <Field name="salePrice">
                                                    {(props) => (
                                                        <>
                                                            <FormControl placeholder="Sale price" id="salePrice" as="input" type="number"  {...props.field} />
                                                            <FormLabel htmlFor="salePrice">Sale price</FormLabel>
                                                        </>
                                                    )}
                                                </Field>
                                            </FormGroup>
                                        </>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>

                        </section>
                        {/* Colors */}
                        <section >
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link">
                                            Colors
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse>

                                        <FieldArray name="colors">
                                            {({ form, push }) => (
                                                <>
                                                    {form.values.colors.map((color, index) => (
                                                        <div className="color-block" key={index}> {/*color block*/}
                                                            <FormGroup className="text">
                                                                <Field name={`colors[${index}].colorName`} >
                                                                    {(props) => (
                                                                        <>
                                                                            <FormControl placeholder={`#${index + 1} Color name`} id={`colorName-${index}`} as="input" type="text"  {...props.field} />
                                                                            <FormLabel htmlFor={`colorName-${index}`}>{`#${index + 1} Color name`}</FormLabel>
                                                                        </>
                                                                    )}
                                                                </Field>
                                                            </FormGroup>
                                                            {['xs', 's', 'm', 'l', 'xl'].map((size) => (
                                                                <FormGroup className="check" key={size}>
                                                                    <Field name={`colors[${index}].sizes.${size}`} >
                                                                        {(props) => (
                                                                            <>
                                                                                <FormControl id={`${size}-${index}`} checked={form.values.colors[index].sizes[size]} as="input" type="checkbox"  {...props.field} />
                                                                                <FormLabel htmlFor={`${size}-${index}`}>{size.toUpperCase()}</FormLabel>
                                                                            </>
                                                                        )}
                                                                    </Field>
                                                                </FormGroup>
                                                            ))}
                                                            <Row>
                                                                <Col>
                                                                    <FormGroup className="file">
                                                                        <Field name={`colors[${index}].primaryImage`} >
                                                                            {(props) => (
                                                                                <>
                                                                                    <FormControl id={`primaryImage-${index}`} as="input" type="file" accept={"image/*"} onChange={(e) => handleFileChange(e.target.files, props)} />
                                                                                    <FormLabel htmlFor={`primaryImage-${index}`}>Primary image <FontAwesomeIcon icon={faUpload} /></FormLabel>
                                                                                    {props.field.value &&
                                                                                        <div className="image-preview">
                                                                                            <img alt="no" src={props.field.value.buffer || props.field.value.link} />
                                                                                            {<Button variant="outline-danger" className="delete-image" onClick={(e) => props.form.setFieldValue(props.field.name, "")}>Remove image</Button>}
                                                                                        </div>
                                                                                    }
                                                                                </>
                                                                            )}

                                                                        </Field>
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col>
                                                                    <FormGroup className="file">
                                                                        <Field name={`colors[${index}].secondaryImage`} >
                                                                            {(props) => (
                                                                                <>
                                                                                    <FormControl id={`secondaryImage-${index}`} as="input" type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files, props)} />
                                                                                    <FormLabel htmlFor={`secondaryImage-${index}`}>Secondary image <FontAwesomeIcon icon={faUpload} /></FormLabel>
                                                                                    {props.field.value &&
                                                                                        <div className="image-preview">
                                                                                            <img alt="no" src={props.field.value.buffer || props.field.value.link} />
                                                                                            {<Button variant="outline-danger" className="delete-image" onClick={(e) => props.form.setFieldValue(props.field.name, "")}>Remove image</Button>}
                                                                                        </div>
                                                                                    }
                                                                                </>
                                                                            )}
                                                                        </Field>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <FormGroup className="file">
                                                                <Field name={`colors[${index}].gallery`} >
                                                                    {(props) => (
                                                                        <>
                                                                            <FormControl id={`gallery-${index}`} multiple={true} as="input" type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files, props)} />
                                                                            <FormLabel htmlFor={`gallery-${index}`}>Gallery <FontAwesomeIcon icon={faUpload} /></FormLabel>
                                                                            {props.field.value && props.field.value.length > 0 &&
                                                                                props.field.value.map((image, index) => (
                                                                                    <div key={index} className="image-preview">
                                                                                        <img alt="no" src={image.buffer || image.link} />
                                                                                        <Button variant="outline-danger" className=" delete-image"
                                                                                            onClick={(_) => { props.form.setFieldValue(props.field.name, props.field.value.filter((_, imageIndex) => index !== imageIndex)) }}
                                                                                        >Remove image</Button>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </>
                                                                    )}
                                                                </Field>
                                                            </FormGroup>
                                                        </div>
                                                    ))}
                                                    <Button className="add-new color" onClick={(e) => { e.preventDefault(); push(defaultInitialValues.colors[0]) }} variant="outline-success">Add new color <FontAwesomeIcon icon={faPlus} /></Button>
                                                </>
                                            )}
                                        </FieldArray>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </section>
                        {/* specifications */}
                        <section >
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link">
                                            Specifications
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse>

                                        <FieldArray name="specifications">
                                            {({ form, push }) => (
                                                <>
                                                    {form.values.specifications.map((specification, index) => (
                                                        <FormGroup className="text" key={index}>
                                                            <Field name={`specifications[${index}]`} key={`specification-${index}`}>
                                                                {(props) => (
                                                                    <>
                                                                        <FormControl placeholder={`Specification #${index + 1}`} id={`spec-${index}`} as="input" type="text"  {...props.field} />
                                                                        <FormLabel htmlFor={`spec-${index}`}>{`Specification #${index + 1}`}</FormLabel>
                                                                    </>
                                                                )}
                                                            </Field>
                                                        </FormGroup>
                                                    ))}
                                                    <Button className="add-new specification" onClick={(e) => { e.preventDefault(); push("") }} variant="outline-success">Add new specification <FontAwesomeIcon icon={faPlus} /></Button>

                                                </>
                                            )}
                                        </FieldArray>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </section>
                        <button type="submit">Submit</button>
                    </Container>
                </Form>
            )}
        </Formik>

    )
}

export default ProductForm
