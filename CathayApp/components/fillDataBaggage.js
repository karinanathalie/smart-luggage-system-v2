import * as React from 'react';
import { useState } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import colors from '../assets/colors/colors';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native';
import BaggageSubmitButton from './baggageSubmitButton';

export default fillDataBaggage = () => {
    const navigation = useNavigation();
    const [selectedButton, setSelectedButton] = useState('fillDataBaggage');
    const [selectedOptions, setSelectedOptions] = useState('')
    const [numberOfItems, setNumberOfItems] = useState(1);
    const [additionalItems, setAdditionalItems] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState([false, false, false]);

    const [cabinWeight, setCabinWeight] = useStatezw('');
    const [cabinStatus, setCabinStatus] = useState('Submit');

    const [baggageWeights, setBaggageWeights] = useState('');
    const [baggageStatus, setBaggageStatus] = useState(['Submit', 'Submit', 'Submit']);

    const costPerPiece = 703.0;
    const asiaMilesPerBaggage = 621;

    const toggleExpand = (index) => {
        setIsExpanded((prevIsExpanded) => {
            const updatedIsExpanded = [...prevIsExpanded];
            updatedIsExpanded[index] = !updatedIsExpanded[index];
            return updatedIsExpanded;
        });
    };

    const handleOptionPress = (index, option) => {
        setSelectedOptions((prevSelectedOptions) => {
            const updatedSelectedOptions = [...prevSelectedOptions];
            updatedSelectedOptions[index] = option;
            return updatedSelectedOptions;
        });
        toggleExpand(index)
      };

    const [isChecked1, setChecked1] = useState(false);
    const handleCheckBox1Press = () => {
        setChecked1(!isChecked1);
    };

    const [isChecked2, setChecked2] = useState(false);
    const handleCheckBox2Press = () => {
        setChecked2(!isChecked2);
    };

    const [isChecked3, setChecked3] = useState(false);
    const handleCheckBox3Press = () => {
        setChecked3(!isChecked3);
    };

    const goBack = () => {
        navigation.navigate('HomePage'); 
    };

    const goProfile = () => {
        navigation.navigate('profile'); 
    };

    const incrementItems = () => {
        if (numberOfItems < 3) {
            setNumberOfItems(numberOfItems + 1);
            setAdditionalItems(additionalItems+ 1);
        }
      };
    
    const decrementItems = () => {
        if (numberOfItems > 0) {
          setNumberOfItems(numberOfItems - 1);
          setAdditionalItems(additionalItems - 1);
        }
      };

    const totalCost = costPerPiece * additionalItems;
    const additionalLabel = additionalItems > 0 ? `HKD ${totalCost.toFixed(2)}` : '';

    const asiaMilesLabel = additionalItems < 0 ? (
        <View style={styles.asiaMilesContainer}>
            <Image source={require('../assets/images/asiaMiles.png')} style={styles.asiaMilesIcon} />
            <Text style={styles.asiaMilesText}>{asiaMilesPerBaggage}</Text>
        </View>
        ) : '';
    
    const handleSubmitCabin = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/cabin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                itemSelected:
                  isChecked1 ? 'Normal'
                  : isChecked2 ? 'Small'
                  : "No",
                weight: cabinWeight
              }),
            });
          
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Server response:', errorData);
              throw new Error(`HTTP error ${response.status}: ${errorData.message}`);
            }
            const data = await response.json();
            console.log('Server response:', data);
            setCabinStatus('Submitted')
          } catch (error) {
            console.error('Error:', error);
          }
    };

    const handleSubmitBaggage = async (index) => {
        try {
            const response = await fetch('http://localhost:3001/api/baggage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                trackingNumber: '123',
                ownerName: 'John Smith',
                weight: baggageWeights[index],
                size: selectedOptions[index],
              }),
            });
          
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Server response:', errorData);
              throw new Error(`HTTP error ${response.status}: ${errorData.message}`);
            }
            const data = await response.json();
            console.log('Server response:', data);
            setBaggageStatus((prevBaggageStatus) => {
                const updatedBaggageStatus = [...prevBaggageStatus];
                updatedBaggageStatus[index] = 'Submitted';
                return updatedBaggageStatus;
            });
          } catch (error) {
            console.error('Error:', error);
          }
    };
      
    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView style={styles.headerContainer}>
            <TouchableOpacity onPress={goBack}>
                <Image source={require('../assets/images/back.png')} style={styles.back} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Fill Data Baggage</Text>

            {/* <TouchableOpacity onPress={openMenu}> */}
            <TouchableOpacity>
                <Image source={require('../assets/images/menu.png')} style={styles.menu} />
            </TouchableOpacity>
            </SafeAreaView>
            
            {/* Passenger Type */}
            <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={goProfile}>
            <View style={styles.passengerInformation}>
                    <View style={styles.justifyInfo}> 
                        <Image source={require('../assets/images/profile.png')} style={styles.passengerProfile}/>
                        <Text style={styles.passengerName}>Mr John Smith</Text>
                    </View>
            </View>
            </TouchableOpacity>
            <View style={styles.flightTypeContainer}> 
                <Text style={styles.flightTypelInfo}>Economy </Text>
                <Text style={styles.flightWeightInfo}> Light</Text>
            </View>

            <View style={styles.bookingReference}> 
                <Text style={styles.titleText}>Cabin Baggage</Text>
                <Text style={styles.questionText}>What item will you bring?</Text>
                {!isChecked2 && !isChecked3 &&
                <TouchableOpacity onPress={handleCheckBox1Press} disabled={cabinStatus === 'Submitted'}>
                    <View style={styles.justifyInfo}>
                        <Image
                        source={isChecked1 ? require('../assets/images/checked.png') : require('../assets/images/checkbox.png')}
                        style={styles.checkBox} />
                        <Text style={styles.itemText}>1 Piece of Cabin Luggage</Text>
                    </View>
                </TouchableOpacity>
                }
                {!isChecked1 && !isChecked3 &&
                <TouchableOpacity onPress={handleCheckBox2Press} disabled={cabinStatus === 'Submitted'}>
                    <View style={styles.justifyInfo}>
                        <Image
                        source={isChecked2 ? require('../assets/images/checked.png') : require('../assets/images/checkbox.png')}
                        style={styles.checkBox} />
                        <Text style={styles.itemText}>1 Small Item</Text>
                    </View>
                </TouchableOpacity>
                }
                {!isChecked1 && !isChecked2 &&               
                <TouchableOpacity onPress={handleCheckBox3Press} disabled={cabinStatus === 'Submitted'}>
                <View style={styles.justifyInfo}>
                        <Image
                        source={isChecked3 ? require('../assets/images/checked.png') : require('../assets/images/checkbox.png')}
                        style={styles.checkBox} />
                        <Text style={styles.itemText}>I don't bring any cabin luggage</Text>
                </View>
                </TouchableOpacity>
                }

                <Text style={styles.questionText}>How many Kg (in total)?</Text>
                <View style={styles.answerBox}>
                    <TextInput
                        style={styles.itemText}
                        placeholder={isFocused ? '' : '7.00 Kg'}
                        placeholderTextColor={colors.greyLight}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChangeText={(value) => value <= 7? setCabinWeight(value) : "Exceed limit weight"}
                        value={cabinWeight}
                        keyboardType="numeric"
                        editable={cabinStatus !== 'Submitted'}
                        disabled={cabinStatus === 'Submitted'}
                    />
                </View>
                {cabinWeight && (isChecked1 || isChecked2 || isChecked3) &&
                    <TouchableOpacity onPress={handleSubmitCabin} disabled={cabinStatus === 'Submitted'}>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.buttonTitle}>{cabinStatus}</Text>
                        </View>
                    </TouchableOpacity>
                }

            </View>

            <View style={styles.bookingReference}> 
                <Text style={styles.titleText}>Check-in Baggage</Text>
                <Text style={styles.questionText}>How many item will you bring?</Text>

                <Image source={require('../assets/images/lineProperties.png')}/>
                <Text style={styles.addLuggageText}>Add and purchase extra baggage up to a maximum of 3 piece(s) per adult</Text>
                <Text style={styles.luggageInfo}>From HKD 703.00/piece</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={decrementItems}>
                        <View style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>-</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{numberOfItems} Piece(s)</Text>
                    <TouchableOpacity onPress={incrementItems}>
                        <View style={styles.quantityButton}>
                        <Text style={styles.quantityButtonText}>+</Text>
                        </View>
                    </TouchableOpacity>
                    {additionalLabel !== '' && <Text style={styles.additionalLabel}>{additionalLabel}</Text>}
                    {asiaMilesLabel !== '' && <Text style={styles.additionalLabel}>{asiaMilesLabel}</Text>}
                </View>

                {[...Array(numberOfItems)].map((_, index) => (
                    <View key={index}>
                    <Text style={styles.questionText}>
                        {`How many Kg (Baggage ${index + 1})?`}
                    </Text>
                    <View style={styles.answerBox}>
                        <TextInput
                            style={styles.itemText}
                            placeholder={isFocused ? '' : '23.00 Kg'}
                            placeholderTextColor={colors.greyLight}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onChangeText={(value) => {
                                const updatedBaggageWeights = [...baggageWeights];
                                updatedBaggageWeights[index] = value;
                                setBaggageWeights(updatedBaggageWeights);
                              }}
                            value={baggageWeights[index]}
                            keyboardType="numeric"
                            editable={baggageStatus[index] !== 'Submitted'}
                            disabled={baggageStatus[index] === 'Submitted'}
                        />
                    </View>
                    <Text style={styles.questionText}>
                        {`What is the size of the baggage (Baggage ${index + 1})?`}
                    </Text>
                    <View style={styles.answerBox}>
                        <View style={styles.justifyInfo}>
                            <Text style={styles.itemText}>{selectedOptions[index]}</Text>
                            <View style={styles.down}>
                            <TouchableOpacity onPress={() => toggleExpand(index)} disabled={baggageStatus[index] === 'Submitted'}>
                                <Image
                                    source={require('../assets/images/down.png')}
                                    style={[styles.down, isExpanded && styles.expandedDown]}
                                />
                            </TouchableOpacity>
                            </View>
                        </View>

                        {/* Expanded options */}
                        {isExpanded[index] && (
                            <View style={styles.expandedBox}>
                                <TouchableOpacity onPress={() => handleOptionPress(index, 'Small (± 57 x 39 x 22 cm)')}>
                                    <Text style={styles.additionalOptionText}>Small (± 57 x 39 x 22 cm)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleOptionPress(index, 'Medium (± 60 x 43 x 26 cm)')}>
                                    <Text style={styles.additionalOptionText}>Medium (± 60 x 43 x 26 cm)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleOptionPress(index, 'Large (± 69 x 47 x 35.5 cm)')}>
                                    <Text style={styles.additionalOptionText}>Large (± 69 x 47 x 35.5 cm)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleOptionPress(index, 'Extra Large (± 81 x 55.8 x 35.5 cm)')}>
                                    <Text style={styles.additionalOptionText}>Extra Large (± 81 x 55.8 x 35.5 cm)</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleOptionPress(index, 'Special Items (Measured During Check-in')}>
                                    <Text style={styles.additionalOptionText}>Special Items (Measured During Check-in)</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>
                    <Text style={styles.measure}>Measure with Camera</Text>
                    {selectedOptions && baggageWeights &&
                        <BaggageSubmitButton
                            baggageWeight={baggageWeights[index]}
                            selectedOption={selectedOptions[index]}
                            baggageStatus={baggageStatus[index]}
                            onSubmit={() => handleSubmitBaggage(index)}
                        />
                    }
                    </View>
                ))}
            </View>

            <View style={styles.additionalReference}> 
                <View style={styles.justifyInfo}>
                    <Image source={require('../assets/images/infoMenu.png')} style={styles.infoMenu} />
                    <Text style={styles.additionalTitle}>Oversize & Special Items</Text>
                </View>
            </View>
            </ScrollView>

            {additionalLabel !== '' && (
                <View style={styles.bottomContainer}>
                    <View style={styles.justifyInfo}>
                        <Text style={styles.prepaidBagTotalText}>Prepaid Bag Total:</Text>
                        <Text style={styles.prepaidBagTotalValue}>{additionalLabel}</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={styles.reviewAndPayButton}>
                            <Text style={styles.reviewAndPayButtonText}>Review and Pay</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {asiaMilesLabel !== '' && (
                <View style={styles.bottomContainer}>
                    <View style={styles.justifyInfo}>
                        <Text style={styles.prepaidBagTotalText}>Prepaid Bag Total:</Text>
                        <Text style={styles.prepaidBagTotalValue}>{asiaMilesLabel}</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={styles.reviewAndPayButton}>
                            <Text style={styles.reviewAndPayButtonText}>Review and Pay</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  passengerInformation:{
        padding: 10,
        borderWidth: 1,
        marginTop: 20,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        width: '100%',
        marginLeft: 'auto', 
        marginRight: 'auto', 
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
  passengerName:{
        fontFamily: 'Montserrat-Regular',
        fontSize: 25,
        color: colors.background,
    },
  passengerProfile:{
        marginLeft: 10,
        width: 40, 
        marginRight: 12,
        aspectRatio: 1, 
    },
  headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginTop: 65,
  },
  menu: {
      marginRight: 5,
      right: 0,
  },
  back: {
      marginLeft: 5,
  },
  headerText: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 23,
      color: colors.primary,
  },
  infoText:{
      fontFamily: 'Montserrat-Regular',
      fontSize: 14,
      marginTop: 5,
      marginBottom: 5,
      color: colors.HomePagebackground,
  },
  infoDestText:{
      fontFamily: 'Montserrat-Regular',
      fontSize: 26,
      color: colors.background,
  },
  flightTypeContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    width: '100%',
    marginLeft: 'auto', 
    marginRight: 'auto', 
    backgroundColor: colors.green,
    borderColor: colors.green,
},
flightTypelInfo:{
    flexDirection: 'row',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primary,
},
flightWeightInfo:{
    flexDirection: 'row',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.primary,
},
bookingReference :{
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignContent: 'center',
    marginLeft: 'auto', 
    marginRight: 'auto', 
    backgroundColor: colors.white,
    borderColor: colors.stroke,
},
titleText:{
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 23,
    color: colors.greyLight,
},
questionText:{
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
    color: colors.primary,
},
justifyInfo:{
    flexDirection: 'row', 
    marginTop: 5,
    alignItems: 'center',
    marginBottom: 5,
},
itemText:{
    fontFamily: 'Montserrat-Regular',
    marginHorizontal: 10,   
    fontSize: 14,
    color: colors.greyLight,
},
checkBox:{
    marginLeft: 5,
    width: 16,
    aspectRatio: 1,
},
answerBox:{
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 10,
    width: '100%',
    marginLeft: 'auto', 
    marginRight: 'auto', 
    borderColor: colors.primary,
},
infoText:{
    fontFamily: 'Montserrat-Regular',
    marginHorizontal: 10,   
    fontSize: 15,
    color: colors.grey,
    marginBottom: 10,
},
addLuggageText:{
    fontFamily: 'Inter-Light',  
    fontSize: 13,
    color: colors.blue,
    marginTop: 5,
},
luggageInfo:{
    fontFamily: 'Inter-Light',  
    fontSize: 13,
    color: colors.greyLight,
    marginTop: 5,
},
quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
},
quantityButton: {
    backgroundColor: colors.blueLight,
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
},
quantityButtonText: {
    color: colors.blue,
    fontSize: 20,
},
quantityText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: colors.grey,
    marginHorizontal: 5,
},
additionalTitle:{
    fontFamily: 'Inter-Medium',  
    fontSize: 16,
    color: colors.primary,
},
infoMenu:{
    marginHorizontal: 5,
    width: 25,
    aspectRatio: 1,
},
additionalReference :{
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 30,
    width: '100%',
    alignContent: 'center',
    marginLeft: 'auto', 
    marginRight: 'auto', 
    backgroundColor: colors.white,
    borderColor: colors.stroke,
},
measure:{
    flexDirection: 'row',
    fontFamily: 'Inter-Light',
    marginLeft: 'auto', 
    marginTop: 6,
    fontSize: 13,
    color: colors.blue,
    fontStyle: 'italic', 
    textDecorationLine: 'underline',  
},
additionalLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 'auto', 
    alignSelf: 'flex-end',
    marginBottom: 7,
    color: colors.greyLight, 
},
asiaMiles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    alignSelf: 'flex-end',
},
bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
},
prepaidBagTotalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.primary,
    marginBottom: 15,
},
prepaidBagTotalValue: {
    fontFamily: 'Inter-SemiBold',
    marginLeft: 'auto', 
    alignSelf: 'flex-end',
    fontSize: 16,
    color: colors.greyLight,
    marginBottom: 10,
    marginRight: 3,
},
reviewAndPayButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
},
reviewAndPayButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.white,
},
asiaMilesContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
},
asiaMilesIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
},
asiaMilesText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.greyLight,
},
down: {
    width: 20,
    height: 20,
    marginLeft: 40,
    resizeMode: 'contain',
    marginLeft: "auto",
    alignSelf: 'flex-end',
    marginRight: 5,
    aspectRatio: 1,
  },
expandedDown: {
    transform: [{ rotate: '180deg' }],
  },
  additionalOptionText: {
    fontFamily: 'Montserrat-Regular',
    marginHorizontal: 10,   
    marginTop: 10,
    marginBottom: 5,
    fontSize: 14,
    color: colors.greyLight,
  },
line:{
    marginTop: 5,
    width: 330,
},
buttonContainer: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginRight: 10,
},
buttonTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.blue,
    fontStyle: 'italic', 
    textDecorationLine: 'underline',  
},
})
