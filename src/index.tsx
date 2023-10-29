import { useState, FocusEvent, ChangeEvent } from "react"
import { createRoot } from "react-dom/client"
import classnames from "classnames"
import { useFormik } from "formik"
import * as yup from "yup"

import bgSidebarMobile from "./assets/bg-sidebar-mobile.svg"
import bgSidebarDesktop from "./assets/bg-sidebar-desktop.svg"
import advancedIcon from "./assets/icon-advanced.svg"
import arcadeIcon from "./assets/icon-arcade.svg"
import proIcon from "./assets/icon-pro.svg"
import checkMarkIcon from "./assets/icon-checkmark.svg"
import thankYouIcon from "./assets/icon-thank-you.svg"

import "./index.css"

const initialValues = {
  name: "",
  email: "",
  phoneNumber: "",
}

const App = () => {
  const [step, setStep] = useState(1)
  const plans = [
    {
      name: "Arcade",
      monthlyPrice: 9,
      yearlyPrice: 90,
      yearlyDiscountText: "2 months free",
      img: arcadeIcon,
    },
    {
      name: "Advanced",
      monthlyPrice: 12,
      yearlyPrice: 120,
      yearlyDiscountText: "2 months free",
      img: advancedIcon,
    },
    {
      name: "Pro",
      monthlyPrice: 15,
      yearlyPrice: 150,
      yearlyDiscountText: "2 months free",
      img: proIcon,
    },
  ]
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0)
  const [yearlyPlanActive, setYearlyPlanActive] = useState(false)
  const [addons, setAddons] = useState([
    {
      name: "Online service",
      description: "Access to multiplayer games",
      monthlyPrice: 1,
      yearlyPrice: 10,
      isActive: true,
    },
    {
      name: "Larger storage",
      description: "Extra 1TB of cloud save",
      monthlyPrice: 2,
      yearlyPrice: 20,
      isActive: false,
    },
    {
      name: "Customizable profile",
      description: "Custom theme on your profile",
      monthlyPrice: 2,
      yearlyPrice: 20,
      isActive: false,
    },
  ])
  const { handleChange, handleBlur, handleSubmit, ...form } = useFormik({
    initialValues,
    validationSchema: yup.object({
      name: yup
        .string()
        .required("Name is required"),
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required"),
      phoneNumber: yup
        .string()
        .required("Phone Number is required")
        .length(11, "Must have 10 digits"),
    }),
    onSubmit: (values) => {
      setStep(step + 1)
    },
  })

  const activePlan:{
    name: string,
    price: number,
  } = {
    name: plans[selectedPlanIndex].name,
    price: yearlyPlanActive ? plans[selectedPlanIndex].yearlyPrice : plans[selectedPlanIndex].monthlyPrice,
  }
  const activeAddons = addons.filter(addon => addon.isActive)
  const duration = yearlyPlanActive ? "yr" : "mo"
  const totalPrice = activePlan.price + activeAddons.reduce((acc, addon) => {
    const price = yearlyPlanActive ? addon.yearlyPrice : addon.monthlyPrice
    return acc + price
  }, 0)

  const toggleAddon = (index:number) => {
    setAddons(addons.map((addon, addonIndex) => {
      if (addonIndex !== index) {
        return addon
      }
      
      return {
        ...addon,
        isActive: !addon.isActive,
      }
    }))
  }

  const handleBackButtonClick = () => {
    setStep(step - 1)
  }

  const handleNextButtonClick = () => {
    if (step === 1) {
      form.submitForm()
      return
    }

    setStep(step + 1)
  }

  const hasError = (name: keyof typeof initialValues) => {
    return form.touched[name] && form.errors[name]
  }

  const handlePhoneNumberChange = (event:ChangeEvent<HTMLInputElement>) => {
    const stateValue = form.values.phoneNumber
    let value = event.target.value.replace(/ /g, "")

    if (stateValue === "") {
      value = "+1" + value
    }

    if (form.values.phoneNumber === value) {
      value = value.slice(0, value.length - 1)
    }

    form.setFieldValue("phoneNumber", value)
  }

  const handlePhoneNumberFocus = () => {
    if (form.values.phoneNumber === "") {
      form.setFieldValue("phoneNumber", "+1")
    }
  }

  const handlePhoneNumberBlur = (event:FocusEvent) => {
    handleBlur(event)

    if (form.values.phoneNumber === "+1") {
      form.setFieldValue("phoneNumber", "", true)
    }
  }

  const addSpacesToPhoneNumber = (phoneNumber:string) => {
    let newPhoneNumber = ""

    for (let i = 0; i < phoneNumber.length; i++) {
      const after = (i === 1 || i === 4 || i === 7) ? " " : ""
      newPhoneNumber += phoneNumber[i] + after
    }

    return newPhoneNumber
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full md:hidden">
        <img src={bgSidebarMobile} className="w-full" />
      </div>
      <div className="h-screen flex items-center bg-gray-200">
        <div className="container mx-auto p-0 relative z-10 h-screen flex flex-col md:h-auto md:my-auto md:p-4 md:flex-row md:bg-white md:rounded-16 md:shadow-2xl">
          <div className="relative w-full md:max-w-[274px]">
            <img src={bgSidebarDesktop} className="hidden md:block" />
            <div className="static inset-0 py-8 flex justify-center space-x-4 md:absolute md:block md:space-x-0 md:space-y-8">
              {["Your Info", "Select Plan", "Add-Ons", "Summary"].map(
                (name, index) => {
                  const currentStep = index + 1
                  let isActive = currentStep === step

                  if (currentStep === 4 && step === 5) {
                    isActive = true
                  }

                  return (
                    <div className="flex md:pl-8" key={index}>
                      <div
                        className={classnames(
                          "w-8 h-8 flex items-center justify-center border border-white text-14 rounded-full md:font-bold md:tracking-wide",
                          {
                            "bg-white text-blue-400 md:bg-blue-100": isActive,
                            "text-white": !isActive,
                          }
                        )}
                      >
                        {currentStep}
                      </div>
                      <div className="hidden md:block md:ml-4">
                        <p className="text-12 text-blue-200 uppercase">
                          Step {currentStep}
                        </p>
                        <p className="text-14 font-bold font-bold tracking-wide text-white uppercase">
                          {name}
                        </p>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </div>
          <div className="flex grow flex-col justify-between md:ml-4 overflow-hidden">
            {(step < 5) ? (
              <>
                <div className="h-full px-4 pb-2 md:px-20 flex flex-col overflow-y-hidden">
                  <div className="px-6 py-8 flex flex-col bg-white rounded-10 shadow-2xl overflow-y-hidden md:px-0 md:shadow-none">
                    {(step === 1) && (
                      <form onSubmit={handleSubmit}>
                        <h1 className="text-24 font-bold text-blue-400 md:text-32">
                          Personal Info
                        </h1>
                        <p className="text-16 leading-6 text-gray-400 md:mt-2">
                          Please provide your name, email address, and phone
                          number.
                        </p>
                        <div className="mt-6 space-y-4 md:mt-9 md:space-y-6">
                          <div>
                            <div className="flex justify-between">
                              <label className="text-12 text-blue-400 md:text-14">
                                Name
                              </label>
                              <p className={classnames("text-12 font-bold text-red transition-opacity md:text-14", {
                                "opacity-0": !hasError("name"),
                                "opacity-100": hasError("name"),
                              })}>
                                {form.errors.name}
                              </p>
                            </div>
                            <input
                              type="text"
                              className={classnames("mt-1 px-4 py-3 w-full border focus:border-purple-200 text-16 font-medium text-blue-400 rounded-4 placeholder:text-grey-400 outline-none transition-colors md:mt-2", {
                                "border-grey-400": !hasError("name"),
                                "border-red": hasError("name"),
                              })}
                              placeholder="e.g. Stephen King"
                              name="name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={form.values.name}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <label className="text-12 text-blue-400 md:text-14">
                                Email Address
                              </label>
                              <p className={classnames("text-12 font-bold text-red transition-opacity md:text-14", {
                                "opacity-0": !hasError("email"),
                                "opacity-100": hasError("email"),
                              })}>
                                {form.errors.email}
                              </p>
                            </div>
                            <input
                              type="text"
                              className={classnames("mt-1 px-4 py-3 w-full border focus:border-purple-200 text-16 font-medium text-blue-400 rounded-4 placeholder:text-grey-400 outline-none transition-colors md:mt-2", {
                                "border-grey-400": !hasError("email"),
                                "border-red": hasError("email"),
                              })}
                              placeholder="e.g. stephenking@lorem.com"
                              name="email"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={form.values.email}
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <label className="text-12 text-blue-400 md:text-14 whitespace-nowrap">
                                Phone Number
                              </label>
                              <p className={classnames("text-12 font-bold text-red transition-opacity md:text-14", {
                                "opacity-0": !hasError("phoneNumber"),
                                "opacity-100": hasError("phoneNumber"),
                              })}>
                                {form.errors.phoneNumber}
                              </p>
                            </div>
                            <input
                              type="tel"
                              className={classnames(`
                                mt-1 px-4 py-3 w-full border focus:border-purple-200 text-16 font-medium text-blue-400 rounded-4 
                                placeholder:text-grey-400 outline-none transition-colors
                                md:mt-2
                              `, {
                                "border-grey-400": !hasError("phoneNumber"),
                                "border-red": hasError("phoneNumber"),
                              })}
                              placeholder="e.g. +1 234 567 890"
                              name="phoneNumber"
                              onChange={handlePhoneNumberChange}
                              onFocus={handlePhoneNumberFocus}
                              onBlur={handlePhoneNumberBlur}
                              value={addSpacesToPhoneNumber(form.values.phoneNumber)}
                              maxLength={14}
                            />
                          </div>
                        </div>
                        <input type="submit" className="hidden" />
                      </form>
                    )}
                    {(step === 2) && (
                      <>
                        <h1 className="text-24 font-bold text-blue-400 md:text-32">
                          Select your plan
                        </h1>
                        <p className="text-16 leading-6 text-gray-400 md:mt-2">
                          You have the option of monthly or yearly billing.
                        </p>
                        <div className="mt-6 space-y-3 md:mt-9 md:flex md:space-x-4.5 md:space-y-0 overflow-y-auto">
                          {plans.map((plan, index: number) => {
                            const isActive = index === selectedPlanIndex
                            const price = yearlyPlanActive
                              ? plan.yearlyPrice
                              : plan.monthlyPrice

                            return (
                              <button
                                type="button"
                                key={index}
                                className={classnames(
                                  "w-full p-4 flex border text-left rounded-8 md:flex-col hover:border-purple-200",
                                  {
                                    "border-gray-300": !isActive,
                                    "border-purple-200 bg-gray-100": isActive,
                                  }
                                )}
                                onClick={() => setSelectedPlanIndex(index)}
                              >
                                <img src={plan.img} className="mt-1" />
                                <div className="ml-3.5 md:ml-0 md:mt-10">
                                  <p className="text-16 font-medium text-blue-400">
                                    {plan.name}
                                  </p>
                                  <p className="mt-1.5 text-14 text-gray-400">
                                    ${price}/{duration}
                                  </p>
                                  {yearlyPlanActive && (
                                    <p className="mt-1 text-12 text-blue-400">
                                      {plan.yearlyDiscountText}
                                    </p>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                        <div className="mt-6 py-3.5 flex justify-center items-center bg-gray-100 rounded-8 md:mt-8">
                          <p
                            className={classnames("text-14 font-medium", {
                              "text-blue-400": !yearlyPlanActive,
                              "text-gray-400": yearlyPlanActive,
                            })}
                          >
                            Monthly
                          </p>
                          <button
                            type="button"
                            className="px-6"
                            onClick={() =>
                              setYearlyPlanActive(!yearlyPlanActive)
                            }
                          >
                            <div className="w-10 h-5 p-1 bg-blue-400 rounded-full">
                              <div className="w-full h-full relative">
                                <div
                                  className={classnames(
                                    "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white transition-all",
                                    {
                                      "left-0": !yearlyPlanActive,
                                      "left-full -translate-x-full":
                                        yearlyPlanActive,
                                    }
                                  )}
                                ></div>
                              </div>
                            </div>
                          </button>
                          <p
                            className={classnames("text-14 font-medium", {
                              "text-gray-400": !yearlyPlanActive,
                              "text-blue-400": yearlyPlanActive,
                            })}
                          >
                            Yearly
                          </p>
                        </div>
                      </>
                    )}
                    {(step === 3) && (
                      <>
                        <h1 className="text-24 font-bold text-blue-400 md:text-32">
                          Pick add-ons
                        </h1>
                        <p className="text-16 leading-6 text-gray-400 md:mt-2">
                          Add-ons help enhance your gaming experience.
                        </p>
                        <div className="mt-6 space-y-3 md:mt-9 md:space-y-4">
                          {addons.map((addon, index) => {
                            const price = yearlyPlanActive
                              ? addon.yearlyPrice
                              : addon.monthlyPrice

                            return (
                              <button
                                type="button"
                                className={classnames(
                                  "px-4 py-3 w-full flex justify-between items-center border hover:border-purple-200 text-left rounded-8 md:px-6 md:py-4.5 transition",
                                  {
                                    "border-purple-200 bg-gray-100":
                                      addon.isActive,
                                    "border-gray-300": !addon.isActive,
                                  }
                                )}
                                key={index}
                                onClick={() => toggleAddon(index)}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={classnames(
                                      "w-5 h-5 flex shrink-0 items-center justify-center border rounded-4",
                                      {
                                        "border-purple-200 bg-purple-200":
                                          addon.isActive,
                                        "border-gray-300": !addon.isActive,
                                      }
                                    )}
                                  >
                                    <img src={checkMarkIcon} />
                                  </div>
                                  <div className="ml-4">
                                    <p className="text-14 font-medium text-blue-400 md:text-16">
                                      {addon.name}
                                    </p>
                                    <p className="text-12 leading-5 text-gray-400 md:text-14">
                                      {addon.description}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-12 leading-50 text-purple-200 md:text-14">
                                  +${price}/{duration}
                                </p>
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )}
                    {(step === 4) && (
                      <>
                        <h1 className="text-24 font-bold text-blue-400 md:text-32">
                          Finishing up
                        </h1>
                        <p className="text-16 leading-6 text-gray-400 md:mt-2">
                          Double-check everything looks OK before confirming.
                        </p>
                        <div className="mt-5 p-4 bg-gray-100 rounded-8 md:mt-9 md:px-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-14 font-medium text-blue-400 md:text-16">
                                {activePlan.name} (
                                {yearlyPlanActive ? "Yearly" : "Monthly"})
                              </p>
                              <button
                                type="button"
                                className="text-14 leading-5 text-gray-400 hover:text-purple-200 underline transition-colors"
                                onClick={() => setStep(2)}
                              >
                                Change
                              </button>
                            </div>
                            <p className="text-14 leading-5 font-bold text-blue-400 md:text-16">
                              ${activePlan.price}/{duration}
                            </p>
                          </div>
                          {activeAddons.length > 0 && (
                            <div className="mt-3 pt-3 space-y-3 border-t border-gray-400/20 md:mt-6 md:space-y-4">
                              {activeAddons.map((addon, index) => {
                                const price = yearlyPlanActive
                                  ? addon.yearlyPrice
                                  : addon.monthlyPrice

                                return (
                                  <div
                                    className="flex items-center justify-between"
                                    key={index}
                                  >
                                    <p className="text-14 leading-5 text-gray-400">
                                      {addon.name}
                                    </p>
                                    <p className="text-14 leading-5 text-blue-400">
                                      ${price}/{duration}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                        <div className="mt-6 px-4 flex items-center justify-between">
                          <p className="text-14 leading-5 text-gray-400">
                            Total (per month)
                          </p>
                          <p className="text-16 leading-5 font-bold text-purple-200 md:text-20">
                            ${totalPrice}/{duration}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between bg-white md:px-20">
                  <div>
                    {(step > 1) && (
                      <button
                        type="button"
                        className="text-14 font-medium text-gray-400 hover:text-blue-400 transition-colors md:text-16"
                        onClick={() => handleBackButtonClick()}
                      >
                        Go Back
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className={classnames(`
                      px-4 py-3 text-14 font-medium text-white rounded-4 transition-colors
                      md:px-6 md:py-4 md:text-16 md:rounded-8
                    `, {
                      "bg-blue-400 hover:bg-blue-300": step < 4,
                      "bg-purple-200 hover:bg-purple-100": step === 4,
                    })}
                    onClick={() => handleNextButtonClick()}
                  >
                    {step < 4 ? "Next Step" : "Confirm"}
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 md:h-full md:px-20 md:flex md:items-center">
                <div className="px-6 py-20 bg-white text-center rounded-10 shadow-2xl md:px-0 md:shadow-none">
                  <img src={thankYouIcon} className="w-14 mx-auto md:w-auto" />
                  <p className="mt-6 text-24 font-bold text-blue-400 md:mt-8 md:text-32">
                    Thank you!
                  </p>
                  <p className="mt-2 text-16 leading-6 text-gray-400 md:mt-3.5">
                    Thanks for confirming your subscription! We hope you have
                    fun using our platform. If you ever need support, please
                    feel free to email us at support@loremgaming.com.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

createRoot(document.getElementById("app")).render(<App />)