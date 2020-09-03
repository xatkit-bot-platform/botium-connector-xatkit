package com.xatkit.example;

import com.xatkit.core.XatkitCore;
import com.xatkit.plugins.react.platform.ReactPlatform;
import com.xatkit.plugins.react.platform.io.ReactEventProvider;
import com.xatkit.plugins.react.platform.io.ReactIntentProvider;
import lombok.val;
import org.apache.commons.configuration2.BaseConfiguration;
import org.apache.commons.configuration2.Configuration;

import java.util.Arrays;

import static com.xatkit.dsl.DSL.eventIs;
import static com.xatkit.dsl.DSL.fallbackState;
import static com.xatkit.dsl.DSL.intent;
import static com.xatkit.dsl.DSL.intentIs;
import static com.xatkit.dsl.DSL.model;
import static com.xatkit.dsl.DSL.state;

import static com.xatkit.dsl.DSL.any;

public class EchoBot {

    /*
     * Your bot is a plain Java application: you need to define a main method to make the created jar executable.
     */
    public static void main(String[] args) {


        val echo = intent("Echo")
                .trainingSentence("Echo text")
                .context("Echo")
                .parameter("EchoValue").fromFragment("text").entity(any());

        val giveMeButtons = intent("GiveMeButtons")
                .trainingSentence("Give me buttons");

        val selectButtonOne = intent("SelectButtonOne")
                .trainingSentence("Option 1");

        val selectButtonTwo = intent("SelectButtonTwo")
                .trainingSentence("Option 2");

        val giveMeALinkSnippetWithImage = intent("GiveMeALinkSnippetWithImage")
                .trainingSentence("Give me a link snippet with image");


        ReactPlatform reactPlatform = new ReactPlatform();

        ReactEventProvider reactEventProvider = new ReactEventProvider(reactPlatform);
        ReactIntentProvider reactIntentProvider = new ReactIntentProvider(reactPlatform);

        val init = state("Init");
        val awaitingInput = state("AwaitingInput");
        val handleEcho = state("HandleEcho");
        val handleGiveMeButtons = state("handleGiveMeButtons");
        val handleSelectButtonOne = state("HandleSelectButtonOne");
        val handleSelectButtonTwo = state("HandleSelectButtonTwo");
        val handleGiveMeALinkSnippetWithImage = state("HandleGiveMeALinkSnippetWithImage");


        init
                .next()
                .when(eventIs(ReactEventProvider.ClientReady)).moveTo(awaitingInput);

        awaitingInput
                .next()
                .when(intentIs(echo)).moveTo(handleEcho)
                .when(intentIs(giveMeButtons)).moveTo(handleGiveMeButtons)
                .when(intentIs(selectButtonOne)).moveTo(handleSelectButtonOne)
                .when(intentIs(selectButtonTwo)).moveTo(handleSelectButtonTwo)
                .when(intentIs(giveMeALinkSnippetWithImage)).moveTo(handleGiveMeALinkSnippetWithImage);

        handleEcho
                .body(context -> reactPlatform.reply(context, (String) context.getNlpContext().get("Echo").get("EchoValue")))
                .next()
                .moveTo(awaitingInput);

        handleGiveMeButtons
                .body(context -> reactPlatform.reply(context, "Select an option", Arrays.asList("Option 1", "Option 2")))
                .next()
                .when(intentIs(selectButtonOne)).moveTo(handleSelectButtonOne)
                .when(intentIs(selectButtonTwo)).moveTo(handleSelectButtonTwo);

        handleSelectButtonOne
                .body(context -> reactPlatform.reply(context, "Option 1 selected"))
                .next()
                .moveTo(awaitingInput);

        handleSelectButtonTwo
                .body(context -> reactPlatform.reply(context, "Option 2 selected"))
                .next()
                .moveTo(awaitingInput);

        handleGiveMeALinkSnippetWithImage
                .body(context -> reactPlatform.replyLinkSnippet(context, "title example", "http://example.com", "https://via.placeholder.com/150"))
                .next()
                .moveTo(awaitingInput);


        val defaultFallback = fallbackState()
                .body(context -> reactPlatform.reply(context, "Sorry, I didn't get it"));

        val botModel = model()
                .useEvent(echo)
                .useEvent(giveMeButtons)
                .useEvent(selectButtonOne)
                .useEvent(selectButtonTwo)
                .usePlatform(reactPlatform)
                .listenTo(reactEventProvider)
                .listenTo(reactIntentProvider)
                .state(awaitingInput)
                .state(handleEcho)
                .state(handleGiveMeButtons)
                .state(handleSelectButtonOne)
                .state(handleSelectButtonTwo)
                .state(handleGiveMeALinkSnippetWithImage)
                .initState(init)
                .defaultFallbackState(defaultFallback);

        Configuration botConfiguration = new BaseConfiguration();

        XatkitCore xatkitCore = new XatkitCore(botModel, botConfiguration);
        xatkitCore.run();

    }
}
