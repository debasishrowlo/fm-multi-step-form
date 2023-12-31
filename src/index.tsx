import { useMemo, useState, FocusEvent, ChangeEvent } from "react"
import { createRoot } from "react-dom/client"
import classnames from "classnames"
import { useFormik } from "formik"
import * as yup from "yup"
import { Transition } from "@headlessui/react"

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
      isActive: false,
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
        .length(14, "Must have 10 digits"),
    }),
    onSubmit: () => {
      const previousStep = step
      const nextStep = step + 1

      updateTransitionProps(previousStep, nextStep)
      setStep(nextStep)
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
  const totalPrice = useMemo(() => {
    return activePlan.price + activeAddons.reduce((acc, addon) => {
      const price = yearlyPlanActive ? addon.yearlyPrice : addon.monthlyPrice
      return acc + price
    }, 0)
  }, [activePlan, activeAddons, yearlyPlanActive])

  const billingDuration = yearlyPlanActive ? "yr" : "mo"

  const commonTransitionProps = {
    enter: "transition duration-500",
    leave: "transition duration-350",
  }

  const defaultTransitionProps = Array.from(Array(5).keys()).reduce((acc, cur) => {
    return {
      ...acc,
      [cur + 1]: {
        enterFrom: "",
        enterTo: "",
        leaveFrom: "",
        leaveTo: "",
      },
    }
  }, {})
  const [transitionProps, setTransitionProps] = useState<{
    [key: string]: {
      enterFrom: string,
      enterTo: string,
      leaveFrom: string,
      leaveTo: string,
    }
  }>(defaultTransitionProps)

  const updateTransitionProps = (startStep:number, endStep:number) => {
    const fadeInLeft = {
      enterFrom: "-translate-x-4 opacity-0",
      enterTo: "translate-x-0 opacity-100",
    }
    const fadeInRight = {
      enterFrom: "translate-x-4 opacity-0",
      enterTo: "translate-x-0 opacity-100",
    }
    const fadeOutLeft = {
      leaveFrom: "translate-x-0 opacity-100",
      leaveTo: "-translate-x-4 opacity-0",
    }
    const fadeOutRight = {
      leaveFrom: "translate-x-0 opacity-100",
      leaveTo: "translate-x-4 opacity-0",
    }

    let startStepTransition = { ...fadeOutLeft }
    let endStepTransition = { ...fadeInRight }

    if (startStep > endStep) {
      startStepTransition = { ...fadeOutRight }
      endStepTransition = { ...fadeInLeft }
    }

    setTransitionProps({
      ...transitionProps,
      [startStep]: {
        ...transitionProps[startStep],
        ...startStepTransition,
      },
      [endStep]: {
        ...transitionProps[endStep],
        ...endStepTransition,
      },
    })
  }

  const handleNameChange = (e:ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("name", e.target.value.replace(/[^a-zA-z ]/g, ""))
  }

  const toggleAddon = (index:number) => {
    setAddons([
      ...addons.slice(0, index),
      {
        ...addons[index],
        isActive: !addons[index].isActive,
      },
      ...addons.slice(index + 1),
    ])
  }

  const handleBackButtonClick = () => {
    if (step === 1) {
      return
    }

    const previousStep = step
    const nextStep = step - 1

    updateTransitionProps(previousStep, nextStep)
    setStep(nextStep)
  }

  const handleNextButtonClick = () => {
    if (step === 1) {
      form.submitForm()
      return
    }

    const previousStep = step
    const nextStep = step + 1

    updateTransitionProps(previousStep, nextStep)
    setStep(nextStep)
  }

  const hasError = (name: keyof typeof initialValues) => {
    return form.touched[name] && form.errors[name]
  }

  const handlePhoneNumberChange = (event:ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim().replace(/ /g, "")

    let newValue = "+1"

    let lastSliceIndex = null
    if (value.length > 2) {
      lastSliceIndex = 2
    } 
    if (value.length > 5) {
      newValue += " " + value.slice(2, 5)
      lastSliceIndex = 5
    } 
    if (value.length > 8) {
      newValue += " " + value.slice(5, 8)
      lastSliceIndex = 8
    }

    if (lastSliceIndex !== null) {
      newValue += " " + value.slice(lastSliceIndex)
    }

    form.setFieldValue("phoneNumber", newValue)
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

  return (
    <>
      <div className="fixed top-0 left-0 w-full md:hidden">
        <img src={bgSidebarMobile} className="w-full" />
      </div>
      <div className="h-screen flex items-center bg-gray-200">
        <div className="w-full max-w-[940px] mx-auto p-0 relative z-10 h-screen flex flex-col md:h-auto md:my-auto md:p-4 md:flex-row md:bg-white md:rounded-16 md:shadow-2xl">
          <div className="relative w-full md:max-w-[274px]">
            <img src={bgSidebarDesktop} className="hidden md:block" />
            <div className="py-8 flex justify-center space-x-4 md:absolute md:inset-0 md:block md:space-x-0 md:space-y-8">
              {["Your Info", "Select Plan", "Add-Ons", "Summary"].map(
                (name, index) => {
                  const currentStep = index + 1
                  let isActive = currentStep === step

                  if (currentStep === 4 && step > 4) {
                    isActive = true
                  }

                  return (
                    <div className="flex md:pl-8" key={index}>
                      <div
                        className={classnames(
                          "w-8 h-8 flex items-center justify-center border border-white text-14 rounded-full transition-colors duration-500 md:font-bold md:tracking-wide",
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
          <div className="flex grow flex-col justify-between md:ml-4">
            <div className="h-full px-4 pb-2 flex flex-col md:px-20 md:pb-0">
              <div className="grow flex flex-col relative">
                <Transition
                  show={step === 1}
                  className="absolute inset-0 max-h-full px-6 py-8 flex flex-col bg-white rounded-10 shadow-2xl overflow-y-auto md:px-0 md:pb-0 md:shadow-none"
                  {...commonTransitionProps}
                  {...transitionProps["1"]}
                >
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
                          onChange={handleNameChange}
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
                          value={form.values.phoneNumber}
                          maxLength={14}
                        />
                      </div>
                    </div>
                    <input type="submit" className="hidden" />
                  </form>
                </Transition>
                <Transition
                  show={step === 2}
                  className="absolute inset-0 w-full max-h-full px-6 py-8 flex flex-col bg-white rounded-10 shadow-2xl overflow-y-auto md:px-0 md:shadow-none"
                  {...commonTransitionProps}
                  {...transitionProps["2"]}
                >
                  <h1 className="text-24 font-bold text-blue-400 md:text-32">
                    Select your plan
                  </h1>
                  <p className="text-16 leading-6 text-gray-400 md:mt-2">
                    You have the option of monthly or yearly billing.
                  </p>
                  <div className="mt-6 space-y-3 md:mt-9 md:flex md:space-x-4.5 md:space-y-0">
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
                              ${price}/{billingDuration}
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
                </Transition>
                <Transition
                  show={step === 3}
                  className="absolute inset-0 max-h-full px-6 py-8 flex flex-col bg-white rounded-10 shadow-2xl overflow-y-auto md:px-0 md:shadow-none"
                  {...commonTransitionProps}
                  {...transitionProps["3"]}
                >
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
                            +${price}/{billingDuration}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </Transition>
                <Transition
                  show={step === 4}
                  className="absolute inset-0 max-h-full px-6 py-8 flex flex-col bg-white rounded-10 shadow-2xl overflow-y-auto md:px-0 md:shadow-none"
                  {...commonTransitionProps}
                  {...transitionProps["4"]}
                >
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
                        ${activePlan.price}/{billingDuration}
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
                                ${price}/{billingDuration}
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
                      ${totalPrice}/{billingDuration}
                    </p>
                  </div>
                </Transition>
                <Transition
                  show={step === 5}
                  className="absolute max-h-full px-6 py-8 flex flex-col bg-white rounded-10 shadow-2xl md:inset-0 md:px-0 md:shadow-none"
                  {...commonTransitionProps}
                  {...transitionProps["5"]}
                >
                  <div className="h-full py-12 flex flex-col justify-center text-center">
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
                </Transition>
              </div>
            </div>
            {(step < 5) && (
              <div className="relative z-10 p-4 flex items-center justify-between bg-white md:px-20">
                <button
                  type="button"
                  className={classnames("text-14 font-medium text-gray-400 hover:text-blue-400 transition md:text-16", {
                    "opacity-0 pointer-events-none": step === 1,
                    "opacity-full": step > 1,
                  })}
                  onClick={() => handleBackButtonClick()}
                >
                  Go Back
                </button>
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
            )}
          </div>
        </div>
      </div>
    </>
  )
}

createRoot(document.getElementById("app")).render(<App />)