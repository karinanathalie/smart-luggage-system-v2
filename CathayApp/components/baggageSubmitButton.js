import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../assets/colors/colors';

const BaggageSubmitButton = ({ baggageWeight, selectedOption, baggageStatus, onSubmit }) => {
  return (
    <>
      {baggageWeight && selectedOption && (
        <TouchableOpacity onPress={onSubmit}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonTitle}>{baggageStatus}</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default BaggageSubmitButton;

const styles = StyleSheet.create({
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
});